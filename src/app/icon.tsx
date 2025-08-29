import { ImageResponse } from 'next/og'

export const size = {
    width: 32,
    height: 32,
}
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent'
                }}
            >
                <div
                    style={{
                        height: '20px',
                        width: '24px',
                        background: 'linear-gradient(to bottom, #3B82F6, #2563EB)',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '2px',
                        borderBottomRightRadius: '8px',
                        borderBottomLeftRadius: '2px',
                        flexShrink: 0,
                    }}
                />
            </div>
        ),
        { ...size }
    )
}