import { Checkbox, FormControlLabel } from '@mui/material'
import './CustomCheckboxContainer.styles.scss'

function CustomCheckboxContainer(props: CustomCheckboxProps) {
    return (
        <div className='select-container-wraper'>
            <FormControlLabel
                control={<Checkbox checked={props.checked} onChange={props.onChange} name={props.name} />}
                label={props.label}
            />
        </div>
    )
}

interface CustomCheckboxProps {
    name: string;
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default CustomCheckboxContainer