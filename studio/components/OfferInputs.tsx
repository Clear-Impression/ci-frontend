import {set, unset, type StringInputProps} from 'sanity'
import OfferIcon from '../../components/layout/OfferIcon'
import {offerColorSwatches, offerIcons, type OfferIconId} from '../../data/offer-themes'

const hexColor = /^#[0-9a-f]{6}$/i

// For "Make your own": a row of colors to pick with one click, the browser's
// color picker for anything else, and the usual text box for typing a color.
export function OfferColorInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const current = value && hexColor.test(value) ? value.toLowerCase() : '#55ab68'

  return (
    <div style={{display: 'grid', gap: 10}}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
        {offerColorSwatches.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            aria-label={`Use ${color}`}
            aria-pressed={current === color}
            disabled={readOnly}
            onClick={() => onChange(set(color))}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: color,
              border: '1px solid rgb(0 0 0 / 0.2)',
              outline: value?.toLowerCase() === color ? '2px solid #200b38' : 'none',
              outlineOffset: 2,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <input
          type="color"
          aria-label="Pick any color"
          value={current}
          disabled={readOnly}
          onChange={(event) => onChange(set(event.currentTarget.value))}
          style={{width: 44, height: 36, padding: 0, border: 0, background: 'none', cursor: 'pointer'}}
        />
        <div style={{flex: 1}}>{props.renderDefault(props)}</div>
      </div>
    </div>
  )
}

// For "Make your own": every offer icon as a button, so he can see what he's picking.
export function OfferIconInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
      {offerIcons.map(({id, title}) => {
        const picked = value === id
        return (
          <button
            key={id}
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={picked}
            disabled={readOnly}
            onClick={() => onChange(picked ? unset() : set(id))}
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 52,
              height: 52,
              borderRadius: 8,
              border: picked ? '2px solid #6c3fb8' : '1px solid rgb(0 0 0 / 0.15)',
              background: picked ? 'rgb(108 63 184 / 0.1)' : 'transparent',
              color: picked ? '#6c3fb8' : 'inherit',
              cursor: 'pointer',
            }}>
            <span style={{display: 'block', width: 24, height: 24}}>
              <OfferIcon icon={id as OfferIconId} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
