export default function Button(props){
    return <>
        <button className={(props.className ? props.className : "cta")} disabled={props.disabled} onClick={props?.onClick}>{props.text ?? props.children}</button>
    </>
}