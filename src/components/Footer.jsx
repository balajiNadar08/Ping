import { AiFillGithub, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";
import "../App.css";

const Footer = () => {
  return (
    <footer>
      <p>(Balaji Nadar) ? {'{'}</p>
      <ul>
        <li>
          <a target="_blank" href="https://www.linkedin.com/in/balaji-nadar-828b41354/"><AiFillLinkedin /></a>
          <p>||</p>
        </li>
        <li>
          <a target="_blank" href="https://github.com/balajiNadar08"><AiFillGithub /></a>
          <p>||</p>
        </li>
        <li>
          <a target="_blank" href="https://www.instagram.com/balaji_nadar_08/"><AiFillInstagram /></a>
        </li>
      </ul>
      <p>{'}'} : null;</p>
    </footer>
  );
}

export default Footer;