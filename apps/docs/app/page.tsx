import Image from "next/image";

import { Breadcrumbs } from "@/components/landing/breadcrumbs";
import { Tiles } from "@/components/landing/tiles";
import { Title } from "@/components/landing/title";

export default async function HomePage() {
	return (
		<div id="hero" className="relative pt-11.25 lg:pt-0">
			<div className="relative text-foreground" data-v="1">
				<div className="flex flex-col lg:flex-row">
					<div className="relative w-full lg:w-[40%] lg:h-dvh border-b lg:border-b-0 lg:border-r border-foreground/6 px-5 sm:px-6 lg:px-7 lg:sticky lg:top-0 z-10 bg-background lg:overflow-clip">
						<Tiles />
						<div className="hidden lg:flex justify-center h-full absolute items-center left-1/2 -translate-x-1/2 w-full pointer-events-auto select-none animate-logo-reveal z-[1]">
							<div className="group max-w-75 w-full max-h-50 mt-[-30%] hidden dark:flex justify-center opacity-100">
								<Image
									src="/left-3d-logo.svg"
									alt=""
									width={518}
									height={667}
									className="h-auto max-h-50 z-10 animate-logo-snap-left transition-transform duration-300 ease-out group-hover:-translate-x-3 group-hover:-rotate-5"
									priority
									draggable={false}
								/>
								<Image
									src="/right-3d-logo.svg"
									alt=""
									width={518}
									height={667}
									className="h-auto -ml-28 -mt-3 max-h-50 animate-logo-snap-right transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:rotate-5"
									priority
									draggable={false}
								/>
							</div>
							<div className="group max-w-75 w-full max-h-50 mt-[-30%] flex dark:hidden justify-center opacity-100">
								<Image
									src="/left-3d-logo-light.svg"
									alt=""
									width={518}
									height={667}
									className="h-auto max-h-50 z-10 animate-logo-snap-left transition-transform duration-300 ease-out group-hover:-translate-x-3 group-hover:-rotate-5"
									priority
									draggable={false}
								/>
								<Image
									src="/right-3d-logo-light.svg"
									alt=""
									width={518}
									height={667}
									className="h-auto -ml-28 -mt-3 max-h-50 animate-logo-snap-right transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:rotate-5"
									priority
									draggable={false}
								/>
							</div>
						</div>
						<Title />
						<div className="hidden lg:block absolute left-5 right-5 lg:left-7 lg:right-3 bottom-4 z-3">
							<Breadcrumbs />
						</div>
					</div>

					<div className="relative z-0 w-full lg:w-[60%] overflow-x-hidden">
						<div className="flex items-start lg:items-center justify-center">
							{/* TODO: IMPLEMENT THE HERO SECTION*/}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
