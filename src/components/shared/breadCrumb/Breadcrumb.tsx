import { Fragment } from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import './breadcrumb.style.scss'

interface BreadcrumbPropTypes {
    clickableListItems: Array<{
        label: string
        onClick?: () => void
    }>
}

const Breadcrumb = ({ clickableListItems }: BreadcrumbPropTypes) => {
    if (clickableListItems?.length < 2) {
        return <></>
    }

    return (
        <div className="breadcrumbs-container">
            {clickableListItems.map(({ label, onClick }, index) => {
                return (
                    <Fragment key={label}>
                        <span
                            onClick={() => {
                                onClick && onClick()
                            }}
                            className={
                                index + 1 < clickableListItems?.length
                                    ? 'active-breadcrumb'
                                    : ''
                            }
                        >
                            {label}
                        </span>
                        {index + 1 < clickableListItems?.length && (
                            <NavigateNextIcon className="left-vector" />
                        )}
                    </Fragment>
                )
            })}
        </div>
    )
}

export default Breadcrumb
