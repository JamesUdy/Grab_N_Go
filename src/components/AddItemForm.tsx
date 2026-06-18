import { useRef } from 'react'
import styles from './FlipButton.module.css'

interface Props {
  onAdd: (name: string, quantity: string) => void
}

export default function AddItemForm({ onAdd }: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  const quantRef = useRef<HTMLInputElement>(null)

  function handleClick() {
    const name = nameRef.current?.value.trim() ?? ''
    const quantity = quantRef.current?.value.trim() ?? ''
    if (!name) return
    onAdd(name, quantity)
    if (nameRef.current) nameRef.current.value = ''
    if (quantRef.current) quantRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex flex-row items-center justify-center gap-2">
        <input
          ref={nameRef}
          type="text"
          placeholder="Add Items"
          className="bg-[#5c5f6566] border-2 border-[#5c5f6566] rounded-[0.24rem] px-2 py-[0.56rem] text-center text-base text-[#3a3b3cdf] w-40 shadow-[0px_1px_4px_rgb(0,0,0)] outline-[#5c5f65d8] hover:font-bold"
        />
        <input
          ref={quantRef}
          type="text"
          placeholder="Quantity"
          className="bg-[#5c5f6566] border-2 border-[#5c5f6566] rounded-[0.24rem] px-2 py-[0.56rem] text-center text-base text-[#3a3b3cdf] w-40 shadow-[0px_1px_4px_rgb(0,0,0)] outline-[#5c5f65d8] hover:font-bold"
        />
      </div>

      <button className={styles.btn} onClick={handleClick}>
        <span>Item Added</span>
        <span>Grab It</span>
      </button>
    </div>
  )
}
