import { Link } from "react-router-dom";

function NavBar() {
    return(
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/newSession'>New Session</Link>
        </nav>
    )
}

export default NavBar