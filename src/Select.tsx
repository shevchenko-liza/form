import { useState } from 'react';

import classes from './styles.module.scss';

export type SelectOptions = {
    label: string
    value: string | number
}

type SelectProps = {
    options: SelectOptions[]
}
    & (SingleSelectProps | MultipleProps)

type SingleSelectProps = {
    multiple?: false
    value?: SelectOptions
    onChange: (value: SelectOptions | undefined) => void
}

type MultipleProps = {
    multiple: true
    value: SelectOptions[]
    onChange: (value: SelectOptions[]) => void
}

export const Select = ({ value, onChange, options, multiple }: SelectProps) => {
    const [open, setOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    function ClearOption() {
        multiple ? onChange([]) : onChange(undefined)
    }

    function selectOption(option: SelectOptions) {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option)
        }
    }

    function isOptionSelected(option: SelectOptions) {
        return multiple ? value.includes(option) : option === value
    }

    return (
        <>
            <div tabIndex={0} className={classes.container} onClick={() => setOpen(prev => !prev)}>
                <span className={classes.value}>
                    {multiple
                        ? value.map(v => (
                            <button
                                key={v.value}
                                onClick={e => {
                                    e.stopPropagation()
                                    selectOption(v)
                                }}
                                className={classes.option_badge}
                            >
                                {v.label}
                                <span className={classes.remove_btn}>&times;</span>
                            </button>
                        ))
                        : value?.label}
                </span>
                <button onClick={event => { event.stopPropagation(); ClearOption() }}
                    className={classes.button} > &times;</button>
                <div className={classes.divider}></div>
                <div className={classes.caret}></div>
                <ul className={`${classes.options} ${open ? classes.show : ""}`}>
                    {options.map((option, index) => (
                        <li
                            onMouseEnter={() => setHighlightedIndex(index)}
                            key={option.label}
                            onClick={event => { event.stopPropagation(); setOpen(false); selectOption(option) }}
                            className={`${classes.option} ${isOptionSelected(option) ? classes.selected : ""}
                            ${index === highlightedIndex ? classes.highlighted : ""}`}>
                            {option.label}
                        </li>
                    )
                    )}
                </ul>
            </div>
        </>
    )
}