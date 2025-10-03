import { format, parse, parseISO, isValid } from 'date-fns'

export const formatDateSafe = (dateStr?: string| Date | null) => {
    if (!dateStr || typeof dateStr !== "string") return ""

    let date: Date | null = null

    try {
        // 1) ISO chuẩn hoặc yyyy-MM-dd
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
            date = parseISO(dateStr)
        }
        // 2) dd-MM-yyyy
        else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            date = parse(dateStr, "dd-MM-yyyy", new Date())
        }
        // 3) dd/MM/yyyy
        else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
            date = parse(dateStr, "dd/MM/yyyy", new Date())
        }
        // 4) yyyy/MM/dd
        else if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
            date = parse(dateStr, "yyyy/MM/dd", new Date())
        }
        // 5) JS Date string
        else if (/^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{2}\s\d{4}/.test(dateStr)) {
            date = new Date(dateStr)
        }
    } catch {
        date = null
    }

    if (date && isValid(date)) {
        return format(date, "dd/MM/yyyy")
    }

    return "" // hoặc "Ngày không hợp lệ"
}