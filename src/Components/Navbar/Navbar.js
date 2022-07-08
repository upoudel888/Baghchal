import './Navbar.css'
import {Link} from 'react-router-dom'
import logo from '../../assets/logo1.png'

const Navbar = () => {
    const links = [];
    return ( 
        <nav className="main-nav">
            <Link to="/baghchal" className='main-nav__logo'> <img className = 'main-nav__logo__img' src={logo} alt="Play Baghchal Online"/> </Link>
                <div className="main-nav__links">
                {
                    links.map((elem,index) => {
                        return(
                            
                            <Link to={`/baghchal`} key = {index} className = 'main-nav__links__link'>
                                {elem}
                            </Link>
                            
                        )
                    })

                }
                </div>
        </nav>
    );
}
 
export default Navbar;