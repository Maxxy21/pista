import { ImageResponse } from 'next/og'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

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
                    background: '#0E0D0C',
                    borderRadius: 7,
                }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3.4" width="18" height="2.6" rx="1.3" fill="#F2EAD3" />
                    <rect x="5.5" y="12.5" width="3" height="8" rx="1.5" fill="#F2EAD3" fillOpacity="0.55" />
                    <rect x="10.5" y="7" width="3" height="13.5" rx="1.5" fill="#F2EAD3" fillOpacity="0.85" />
                    <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" fill="#C9A227" />
                </svg>
            </div>
        ),
        { ...size }
    )
}
