import React from 'react'
import HomeIcon from "@material-ui/icons/Home";
import {withRouter} from 'react-router-dom'

import './Header.css'

function Header(props) {
    function backtoHome (e)  {
        props.history.push('/')
    }

    return (
        <div className="header">
            <img 
                src="https://i1.wp.com/keicltd.com/wp-content/uploads/2020/07/kei-consulting_logo-e1594949791130.png?fit=300%2C55&ssl=1" 
                alt="KEI"
                onClick={backtoHome} 
            />
        </div>
    )
}

export default withRouter(Header)
