import styles from './style/loader.module.css'

const Loader = () => {
    return(
        <div className={styles.loader}>
            <div className={styles.loaderCircle}></div>
        </div>
    )
}
export default Loader