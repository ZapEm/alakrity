import PropTypes from 'prop-types'
import * as React from 'react'

export default class RatingPicker extends React.Component {

    static propTypes = {
        setRating: PropTypes.func,
        rating: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
    }

    handleClick(e){
        e.preventDefault()
        this.props.setRating(+e.target.dataset.rating)
    }

    render() {
        const { rating } = this.props

        let stars = []

        for ( let i = 1; i <= 5; i++ ) {
            stars.push((i <= rating) ?
                       <i
                           className="material-icons rating-star"
                           key={i}
                           data-rating={i}
                           onClick={::this.handleClick}
                       >star</i> :
                       <i
                           className="material-icons rating-star empty"
                           key={i}
                           data-rating={i}
                           onClick={::this.handleClick}
                       >star_border</i>)
        }


        return <div className="rating-picker">
            {stars}
        </div>
    }
}