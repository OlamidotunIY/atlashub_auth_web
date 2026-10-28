import { cn } from "cn";

const iconSizes = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
    xl: "size-10"
} as const;

const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl"
} as const;

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: keyof typeof iconSizes;
    textColor?: string;
}

const Logo = ({ size = "md", textColor, className, ...props }: LogoProps) => {
    return (
        <div className={cn("flex items-center gap-2 font-medium", className)} {...props}>
            <div className={cn("flex items-center justify-center rounded-sm overflow-hidden bg-primary shrink-0", iconSizes[size])}>
                <img src="https://res.cloudinary.com/dtvshonld/image/upload/v1791359769/Atlashub/icon_mufoxm.png" alt="Atlaspay Logo" className="w-full h-full object-cover" />
            </div>
            <p className={cn(textSizes[size], textColor)}>AtlasHub</p>
        </div>
    )
}

export {
    Logo
}
