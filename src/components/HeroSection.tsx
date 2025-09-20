import React from 'react';
import SolanaRingSvg from '../assets/svgs/solana-ring.svg';
import ArrowRightSvg from '../assets/svgs/arrow-right.svg';

interface HeroSectionProps {
    className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
    return (
        <div className={`${className}`}>
            <div className="bg-black border-b border-stone-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-stone-700">
                    {/* Left Section: Earn While You Hold */}
                    <div className="lg:col-span-1">
                        <div className="p-10 pr-0 h-full">
                            <div className="relative flex flex-col lg:flex-row items-center justify-between h-full">
                                <div className="flex-1 mb-6 lg:mb-0">
                                    <h2 className="text-[40px] font-denton font-light text-primary-100 mb-4 leading-tight">
                                        Earn While<br />  You Hold
                                    </h2>
                                    <p className="text-stone-500 mb-8 text-lg max-w-64">
                                        Turn your liquidity into daily rewards with Cleo Army.
                                    </p>
                                    <button className="bg-primary-200 hover:bg-primary-300 text-stone-900 px-6 py-3 pr-0.5 h-10 transition-colors flex items-center space-x-2">
                                        <span className="font-semibold text-stone-900 text-lg">Join Cleo Army</span>
                                        <img src={ArrowRightSvg} alt="arrow right" className="" />
                                    </button>
                                </div>
                                <div className="flex-shrink-0 absolute right-0 top-0">
                                    <img src={SolanaRingSvg} alt="solana ring" className="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Top + Bottom Split */}
                    <div className="lg:col-span-1 ">
                        <div className="h-full flex flex-col">
                            {/* Top Section: Single row with DEX VOLUME and chart */}
                            <div className="flex-1 border-b border-stone-700 px-[32px] py-[41px]">
                                <div className="grid grid-cols-2 gap-4 h-full">
                                    {/* Left: DEX VOLUME */}
                                    <div className="flex flex-col justify-center">
                                        <div className="space-y-6">
                                            <div className="text-primary-200/40 text-lg  uppercase tracking-wide font-britti">DEX VOLUME</div>
                                            <div className="flex items-center space-x-2 gap-3">
                                                <div className="text-4xl text-primary-200 font-denton tracking-tight">$118.92B</div>
                                                <span className="border border-[#17593C] text-[#32D58E] px-2 py-1 text-xs font-medium bg-[#082016] font-geist">
                                                    +0.22%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: DEX volume with line chart */}
                                    <div className="flex flex-col justify-center">
                                        <div className="space-y-3">

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Split into left and right */}
                            <div className="flex-1 grid grid-cols-2 gap-4 p-8">
                                {/* Bottom Left: Coin Launched */}
                                <div className="flex flex-col justify-center">
                                    <div className="space-y-6">
                                        <div className="text-primary-200/40 text-lg   tracking-wide font-britti font-thin">Coin Launched</div>
                                        <div className="flex items-center space-x-2 gap-3">
                                            <div className="text-4xl text-primary-200 font-denton tracking-tight">27.77K</div>
                                            <span className="border border-[#7E352F] text-[#F97066] px-2 py-1 text-xs font-medium bg-[#311612] font-geist">
                                                +0.22%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Right: Solana */}
                                <div className="flex flex-col justify-center">
                                    <div className="flex flex-col justify-center">
                                        <div className="space-y-6">
                                            <div className="text-primary-200/40 text-lg   tracking-wide font-britti font-thin ">Solana</div>
                                            <div className="flex items-center space-x-2 gap-3">
                                                <div className="text-4xl text-primary-200 font-denton tracking-tight">$199.3</div>
                                                <span className="border border-[#17593C] text-[#32D58E] px-2 py-1 text-xs font-medium bg-[#082016] font-geist">
                                                    +0.22%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Additional content or placeholder */}
                    <div className="lg:col-span-1 p-8">

                    </div>
                </div>
            </div>
        </div>
    );
};

