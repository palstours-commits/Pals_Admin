const MainLayout = ({ style, className, children }) => {
    return (
        <section style={style} className={className}>{children}</section>
    )
}

export default MainLayout