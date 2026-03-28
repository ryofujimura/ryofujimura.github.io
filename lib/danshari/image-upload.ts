export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as string)
    fr.onerror = () => reject(fr.error)
    fr.readAsDataURL(file)
  })
}

export function newProductUid(): string {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function stemFromFileName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").trim()
  return base || "New item"
}
