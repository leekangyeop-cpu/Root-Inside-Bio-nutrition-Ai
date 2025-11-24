import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Root Inside BioNutrition AI',
  description: 'AI-powered nutrition label OCR, validation, and summarization system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
