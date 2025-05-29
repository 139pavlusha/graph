import { FC, ReactNode } from 'react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

import './MatrixTable.css'

type Cell = string | number
type Row = Cell[]

const render = (v: Cell) => {
    if (typeof v !== 'string') return v

    // • рядок містить '\'  ➜  LaTeX
    // • або починається + закінчується на '$'  ➜  LaTeX (залишаємо тільки серединy)
    const isLatex = v.includes('\\') || (/^\$.+\$$/.test(v))

    if (isLatex) {
        const math = v.replace(/^\$/, '').replace(/\$$/, '') // прибрати $…$
        return <InlineMath math={math} />
    }

    return v
}

export const MatrixTable: FC<{ headers: Row; data: Row[] }> = ({ headers, data }) => (
    <div className='matrixTable_scroll'>
        <table className='matrixTable_table'>
            <thead>
                <tr>
                    <th />
                    {headers.map((h, i) => (
                        <th key={i}>{render(h)}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, r) => (
                    <tr key={r}>
                        {row.map((c, i) => (
                            <td key={i}>{render(c)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)
