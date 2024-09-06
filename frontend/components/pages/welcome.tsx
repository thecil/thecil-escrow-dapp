import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LockIcon, ShieldIcon, TrendingUpIcon } from "lucide-react";
import Image from "next/image";

import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function WelcomePage() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-600 sm:text-5xl md:text-6xl">
          <span className="block">Secure Transactions with</span>
          <span className="block text-primary">Smart Contract Escrow</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Experience the future of secure transactions. Our smart contract
          escrow service ensures trust, transparency, and efficiency in your
          digital deals.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <ConnectButton.Custom>
              {({ openConnectModal }) => {
                return (
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium "
                    onMouseDown={openConnectModal}
                    type="button"
                  >
                    Start Your First Escrow
                  </Button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </motion.div>

      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div whileHover={{ scale: 1.05 }} className="pt-6">
            <div className="flow-root rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg">
                    <LockIcon className="h-6 w-6 " aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-600 tracking-tight">
                  Secure Transactions
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Our smart contracts ensure that your funds are securely held
                  and only released when all conditions are met.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="pt-6">
            <div className="flow-root rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg">
                    <ShieldIcon className="h-6 w-6 " aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-600 tracking-tight">
                  Transparent Process
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Every step of the escrow process is recorded on the
                  blockchain, ensuring complete transparency and trust.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="pt-6">
            <div className="flow-root rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 rounded-md shadow-lg">
                    <TrendingUpIcon className="h-6 w-6 " aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-600 tracking-tight">
                  Efficient Settlements
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Smart contracts automate the escrow process, reducing delays
                  and ensuring quick settlements once conditions are met.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-24 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4"
      >
        <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
          <div className="lg:self-center">
            <h2 className="text-3xl font-extrabold  sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block">Start your first escrow today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Join the future of secure transactions. Our smart contract escrow
              service is ready to safeguard your next deal.
            </p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => {
                return (
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium "
                    onMouseDown={openConnectModal}
                    type="button"
                  >
                    Get Started Now
                  </Button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
        <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
          <Image
            width={250}
            height={200}
            className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
            src="/landing_image.jpg"
            alt="App screenshot"
          />
        </div>
      </motion.div>
    </div>
  );
}
