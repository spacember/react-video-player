import "./style.css";
import React from "react";

type IWrapperProps = {
  children: string | JSX.Element | JSX.Element[];
};

const Wrapper: React.FC<IWrapperProps> = ({ children }) => (
  <section>{children}</section>
);

export default Wrapper;
