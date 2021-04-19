import React, { useLayoutEffect, useState } from 'react'
import { InternalColumnType, ResizeHandler, ANTD_EXPAND_BUTTON_WIDTH } from './index'
import { ResizableBox } from 'react-resizable'
interface ResizableTitleProps {
    children: React.ReactChild
    onResize: ResizeHandler
    initialWidth: number
    height: number
    minConstraints: [number, number]
    maxConstraints: [number, number]
}

interface VirtualTableHeaderProps<RecordType> {
    columns: InternalColumnType<RecordType>[]
    handleResize: (index: number) => ResizeHandler
    layoutEffect?: CallableFunction
    minColumnWidth: number
}

function ResizableTitle({
    children,
    onResize,
    initialWidth,
    height,
    minConstraints,
    maxConstraints,
}: ResizableTitleProps): JSX.Element {
    const innerContent = (
        <div className="inner-wrapper">
            <div className="inner-text">{children}</div>
        </div>
    )
    const [width, setWidth] = useState(initialWidth)
    const [isDragging, setIsDragging] = useState(false)
    const handleResize: ResizeHandler = (event, data): void => {
        setWidth(data.size.width)
        onResize(event, data)
    }
    return (
        <div className="react-resizable-wrapper">
            <ResizableBox
                width={width}
                height={height}
                minConstraints={minConstraints}
                maxConstraints={maxConstraints}
                axis="x"
                handle={<span className="resizable-handle" data-drag-active={isDragging} />}
                onResize={handleResize}
                onResizeStart={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onResizeStop={() => {
                    setIsDragging(false)
                }}
                draggableOpts={{ enableUserSelectHack: true }}
            >
                {innerContent}
            </ResizableBox>
        </div>
    )
}

export default function VirtualTableHeader<RecordType>({
    columns,
    handleResize,
    layoutEffect,
    minColumnWidth,
}: VirtualTableHeaderProps<RecordType>): JSX.Element {
    const maxColumnWidth = minColumnWidth * 12
    const height = 60
    useLayoutEffect(() => (typeof layoutEffect === 'function' ? layoutEffect() : undefined))
    return (
        <div className="resizable-virtual-table-header">
            <div className="left-spacer" style={{ width: ANTD_EXPAND_BUTTON_WIDTH }} />
            {columns.map(({ /*ellipsis, key,*/ title, width }, index) => (
                <ResizableTitle
                    key={index}
                    initialWidth={width ?? minColumnWidth}
                    height={height}
                    onResize={handleResize(index)}
                    minConstraints={[minColumnWidth, height]}
                    maxConstraints={[maxColumnWidth, height]}
                >
                    {title}
                </ResizableTitle>
            ))}
        </div>
    )
}