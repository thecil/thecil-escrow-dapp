import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReadEscrow } from "@/hooks/web3/contracts/use-read-escrow";
import { useReadToken } from "@/hooks/web3/contracts/use-read-token";
import { AaveTokens, sepoliaAaveReserveTokens } from "@/lib/aave-contracts";
import { Address, formatUnits } from "@/lib/web3-utils";
import { EscrowStatus, EscrowStatusEnum } from "@/types/escrow";
import Image from "next/image";
import { Separator } from "../ui/separator";

interface TotalByStatus {
  status: string;
  tokens: {
    amount: bigint;
    name: string;
    address: Address;
    img: string;
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
            <CardTitle>Total Escrow Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETH</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle>Pending Escrow</CardTitle>
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
            <CardTitle>Completed Escrow</CardTitle>
          </CardHeader>
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

const TokenBalancesByStatus = ({ data }: { data: TotalByStatus }) => {
  console.log("TokenBalancesByStatus", { data });
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
export default EscrowDetails;
