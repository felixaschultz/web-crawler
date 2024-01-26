import "./Style.css";
export default function Table(props){
    const data = props.data;
    const headers = props.headers;
    return <>
        <article className="table">
            <header className="table-header">
                <div className="table-row">
                    {
                        headers.map((d, i) => {
                            return <div className="table-cell" key={i}>{d}</div>
                        })
                    }
                </div>
            </header>
            <section className="table-body">
                {
                    <div className="table-row">
                        {
                            data.map((d, i) => {
                                const date = new Date(d.expires * 1000);
                                const year = date.getFullYear();
                                const month = date.getMonth() + 1;
                                const day = date.getDate();

                                const expires = (d.session) ? "Session" : `${day}/${month}/${year}`;
                                return <>
                                    <div className="table-cell" key={i}>{d.name}</div>
                                    <div className="table-cell" key={i+1}>{d.domain}</div>
                                    <div className="table-cell" key={i+1}>{d.value}</div>
                                    <div className="table-cell" key={i}>{expires}</div>
                                </>
                            })
                        }
                    </div>
                }
            </section>
        </article>
    </>
}