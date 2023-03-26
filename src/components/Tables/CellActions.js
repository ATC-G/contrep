export default function CellActions({edit, row}){

    return (
        <>
            {edit.allow && <span onClick={() => edit.action(row)}><i className="fas fa-edit text-info" /></span>}
        </>
    )
}