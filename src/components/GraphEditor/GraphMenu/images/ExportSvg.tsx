import { SvgProps } from "../../../../types"

export const ExportSvg = ({ width, height, fill }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20C7.58172 20 4 16.4183 4 12M20 12C20 14.5264 18.8289 16.7792 17 18.2454" stroke={fill} stroke-width="1.5" stroke-linecap="round" />
            <path d="M12 14L12 4M12 4L15 7M12 4L9 7" stroke={fill} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}