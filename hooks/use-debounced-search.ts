import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import qs from 'query-string';


export function useDebouncedSearch(pathname: string | null, initialValue: string, delay: number) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [inputValue, setInputValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  const [isDebouncing, setIsDebouncing] = useState(false)

  // Debounce the input value
  useEffect(() => {
    setIsDebouncing(inputValue !== debouncedValue)
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue)
      setIsDebouncing(false)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [inputValue, delay, debouncedValue])
  
  // Update URL with debounced value
  useEffect(() => {
    if (initialValue !== debouncedValue && !isDebouncing) {
      const url = qs.stringifyUrl({
        url: pathname || '',
        query: {
          ...Object.fromEntries(searchParams.entries()),
          search: debouncedValue || undefined,
        },
      }, { skipEmptyString: true, skipNull: true })
      
      router.push(url)
    }
  }, [debouncedValue, router, pathname, searchParams, initialValue, isDebouncing])
  
  const handleChange = useCallback((value: string) => {
    setInputValue(value)
    setIsDebouncing(true)
  }, [])

  return {
    value: inputValue,
    debouncedValue,
    isDebouncing,
    handleChange,
    setInstantValue: (value: string) => {
      setInputValue(value)
      setDebouncedValue(value)
      setIsDebouncing(false)
    }
  }
} 