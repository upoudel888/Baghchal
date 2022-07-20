import { Helmet } from "react-helmet-async";

const MetaDecorator = ({title,description,link}) => {
    let mainLink = 'https://www.ujjwalpaudel1.com.np'
    return ( 
        <Helmet>
            <title>{title}</title>
            <meta name='description' content = {description}/>
            <link rel='canonical' href = {mainLink + link}/>
        </Helmet>
     );
}
 
export default MetaDecorator;