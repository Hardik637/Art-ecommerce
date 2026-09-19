import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleTouchIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
          position: 'relative',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '130px',
            fontWeight: 900,
            fontFamily: 'serif',
            letterSpacing: '-4px',
            lineHeight: 1,
            marginTop: '8px',
          }}
        >
          Z
        </span>
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '28px',
            height: '28px',
            background: '#FF3B30',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
