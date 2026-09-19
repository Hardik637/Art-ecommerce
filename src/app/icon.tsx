import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = { width: 32, height: 32 }
export const contentType = 'image/x-icon'

export default function Icon() {
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
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: 900,
            fontFamily: 'serif',
            letterSpacing: '-1px',
            lineHeight: 1,
            marginTop: '2px',
          }}
        >
          Z
        </span>
        <div
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            width: '7px',
            height: '7px',
            background: '#FF3B30',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
