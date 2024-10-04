import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReadEscrow } from "@/hooks/web3/contracts/use-read-escrow";
import { useReadToken } from "@/hooks/web3/contracts/use-read-token";
import { AaveTokens, sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import { Address, formatUnits } from "@/lib/web3-utils";
import { EscrowStatus, EscrowStatusEnum } from "@/types/escrow";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { useAaveOracle } from "@/hooks/web3/contracts/use-aave-oracle";

interface TotalByStatus {
  status: string;
  tokens: {
    amount: bigint;
    name: string;
    address: Address;
    img: string;
    priceInBn?: bigint;
    priceFormat?: string;
    tokenTvl?: number;
  }[];
}

const getTokensData = ({ req }: { req: Record<Address, bigint> }) => {
  if (!req) return;
  const _tokens = [];
  for (const [key, value] of Object.entries(req)) {
    const _token = sepoliaAaveReserveTokens.find(
      (rToken) => rToken.address === key
    );
    if (_token && value > 0n)
      _tokens.push({
        ..._token,
        amount: value
      });
  }
  return _tokens;
};

const ContractTvl = ({ data }: { data: TotalByStatus[] }) => {
  const {
    getAssetsPrices,
    isLoadingGetAssetsPrices,
    getAssetsPricesError,
    refetchGetAssetsPrices
  } = useAaveOracle();

  useEffect(() => {
    if (!getAssetsPrices) {
      refetchGetAssetsPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAssetsPrices]);

  //should return total price of all tokens, total tvl by status and total tvl
  const allTvl = useMemo(() => {
    if (!getAssetsPrices) return undefined;

    // filter by status created and dispute
    const tvl = data.filter((escrowStatus) => {
      // console.log("escrowStatus", { escrowStatus });
      if (escrowStatus.status !== "Canceled") {
        // status contain tokens
        if (escrowStatus.tokens && escrowStatus.tokens.length > 0) {
          // find asset price for each token
          const _assets = escrowStatus.tokens.map((token, index) => {
            const _price = getAssetsPrices.find(
              (_asset) => _asset.address === token.address
            );
            if (_price) {
              return (escrowStatus.tokens[index] = {
                ...token,
                priceInBn: _price.priceInBn,
                priceFormat: _price.priceFormat,
                tokenTvl:
                  parseFloat(_price.priceFormat) *
                  parseFloat(
                    formatUnits(token.amount, token.name === "Usdc" ? 6 : 18)
                  )
              });
            }
          });
          return _assets;
        }
      }
    });
    // total tvl, summary of all tokenTvl.
    let totalTvl: number = 0;
    // total tvl by status
    const totalTvlByStatus: { status: string; tvl: number }[] = tvl.map(
      (status) => {
        let _tokensTvl: number = 0;
        status.tokens.forEach((token) => {
          // console.log("totalTvlByStatus", { status: status.status, token });

          if (token.tokenTvl) {
            _tokensTvl += token.tokenTvl;
          }
        });
        return {
          status: status.status,
          tvl: _tokensTvl
        };
      }
    );
    tvl.forEach((status) => {
      status.tokens.forEach((token) => {
        if (token.tokenTvl) {
          totalTvl += token.tokenTvl;
        }
      });
    });
    // console.log("allTvl", { totalTvlByStatus, tvl, totalTvl });

    return { totalTvlByStatus, tvl, totalTvl };
  }, [data, getAssetsPrices]);

  if (isLoadingGetAssetsPrices) return <p>isLoadingGetAssetsPrices</p>;
  if (getAssetsPricesError) return <p>getAssetsPricesError</p>;
  if (allTvl)
    return (
      <div>
        <p>Total TVL: $ {allTvl.totalTvl.toLocaleString("en-us")}</p>
        {allTvl.totalTvlByStatus.map((status) => (
          <div key={status.status} className="flex gap-2 text-gray-500 text-sm">
            <p>{status.status}:</p>
            <p>$ {status.tvl.toLocaleString("en-us")}</p>
          </div>
        ))}
      </div>
    );
};

const TokenBalancesByStatus = ({ data }: { data: TotalByStatus }) => {
  // console.log("TokenBalancesByStatus", { data });
  if (!data.tokens) return <p>No results</p>;
  return (
    <div className="mt-4">
      {data.tokens.map((token, index) => (
        <div key={index} className="flex gap-2 items-center">
          <TokenBalance token={token} />
          <Image
            src={token.img}
            width={100}
            height={100}
            alt="token-logo"
            className="w-4 h-4"
          />
          <p>{token.name} </p>
        </div>
      ))}
    </div>
  );
};

const TokenBalance = ({
  token
}: {
  token: AaveTokens & { amount: bigint };
}) => {
  const { tokenAddress, setTokenAddress, decimals } = useReadToken();

  useEffect(() => {
    if (!tokenAddress || !decimals) setTokenAddress(token.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, decimals, token]);

  return <p>{formatUnits(token.amount, decimals ?? 18)}</p>;
};

const EscrowDetails = () => {
  const { getAllEscrowsTx, isLoadingGetAllEscrowsTx } = useReadEscrow();

  const tokenTotalByStatus = useMemo(() => {
    if (!getAllEscrowsTx) return undefined;

    const totals: { [key: number]: Record<Address, bigint> } = {};

    getAllEscrowsTx.forEach((tx) => {
      const _statusKey = tx.status;
      const _tokenAddrKey = tx.tokenAddr;

      if (totals[_statusKey]) {
        if (totals[_statusKey][_tokenAddrKey]) {
          totals[_statusKey][_tokenAddrKey] += tx.tokenAmount;
        } else {
          totals[_statusKey][_tokenAddrKey] = tx.tokenAmount;
        }
      } else {
        totals[_statusKey] = { [_tokenAddrKey]: tx.tokenAmount };
      }
    });

    const _totalsByStatus = EscrowStatus.map((status, index) => {
      return {
        status,
        tokens: getTokensData({ req: totals[index] })
      };
    });

    // console.log("_totalsByStatus", { getAllEscrowsTx, _totalsByStatus });
    return _totalsByStatus;
  }, [getAllEscrowsTx]);

  if (isLoadingGetAllEscrowsTx) return <p>isLoadingGetAllEscrowsTx</p>;
  if (tokenTotalByStatus)
    return (
      <div className="grid md:grid-cols-3 gap-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle>Contract TVL</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ContractTvl
              data={tokenTotalByStatus as unknown as TotalByStatus[]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="grid gap-2">
              <p>Pending Escrow</p>
              <p className="text-sm text-gray-500">
                All &quot;created&quot; escrows
              </p>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <TokenBalancesByStatus
              data={
                tokenTotalByStatus[
                  EscrowStatusEnum.Created
                ] as unknown as TotalByStatus
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="grid gap-2">
              <p>Completed Escrow</p>
              <p className="text-sm text-gray-500">
                All &quot;approved&quot; escrows
              </p>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <TokenBalancesByStatus
              data={
                tokenTotalByStatus[
                  EscrowStatusEnum.Approved
                ] as unknown as TotalByStatus
              }
            />
          </CardContent>
        </Card>
      </div>
    );
};

export default EscrowDetails;
