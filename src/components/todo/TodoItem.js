import React from 'react';
import PropTypes from 'prop-types';

export const TodoItem = (props) => {
  const handleRemove = props.handleRemove.bind(null, props.id)
  const handleToggle = props.handleToggle.bind(null, props.id)
  return (
    <li>
      <span className='delete-item'><a href="#" onClick={handleRemove}>X</a></span>
      <input type="checkbox" onChange={handleToggle}
        checked={props.isComplete}/> {props.name}
    </li>
  )
}

TodoItem.propTypes = {
  name: PropTypes.string.isRequired,
  isComplete: PropTypes.bool,
  id: PropTypes.number.isRequired
}
