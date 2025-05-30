import { SvgProps } from "../../../../types"

export const ImportSvg = ({ width, height, fill }: SvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L12 14M12 14L15 11M12 14L9 11" stroke={fill} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 20C7.58172 20 4 16.4183 4 12M20 12C20 14.5264 18.8289 16.7792 17 18.2454" stroke={fill} stroke-width="1.5" stroke-linecap="round" />
        </svg>
    )
}