import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function useParallaxScroll(offsetMultiplier: number = 0.5) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * offsetMultiplier])
  return { y }
}
