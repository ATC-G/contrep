import { Pagination, PaginationItem, PaginationLink } from "reactstrap"

function Paginate({page, totalPaginas, handlePageClick, totalRegistros, limit, handleChangeLimit}){
    const limites = [10,20,30,50]
    const getPageIndexOptions = (maxNumberOfOptions, pageSize, pageIndex) => {
        const options = [];
        const pivot = Math.ceil(maxNumberOfOptions/2);
        const lastPageIndex = pageSize;
        
        if (lastPageIndex <= maxNumberOfOptions) {
          while(options.length < lastPageIndex) options.push(options.length);
        } else if (pageIndex < pivot) {
          while(options.length < maxNumberOfOptions) options.push(options.length);
        } else if (pageIndex > (lastPageIndex - pivot)) {
          while(options.length < maxNumberOfOptions) options.unshift(lastPageIndex - options.length + 1);
        } else {
          for (var i = pageIndex - (pivot - 1); options.length < maxNumberOfOptions; i++) {
            options.push(i + 1);
          }
        }
    
        return options;
    }
    
    return (
      <div className="d-flex align-items-center">
        <div className="me-auto">
          <span className="text-muted fs-08">
            Total de registros: 
            <select 
              className="mx-1" 
              style={{borderColor: '#ccc', color: '#74788d'}}
              value={limit}
              onChange={e=>handleChangeLimit(e.target.value)}
            >
              {
                totalRegistros <= 10 ? <option value={totalRegistros}>{totalRegistros}</option> :
                limites.map((item) => (
                  <option value={item} key={item}>{item}</option>
                ))

              }
            </select> de {totalRegistros}
           </span>
        </div>
        <div>
          <Pagination className="pagination pagination-rounded justify-content-end paginate-margin-ul-none">
              <PaginationItem disabled={page === 0}>
              <PaginationLink
                  previous
                  href="#"
                  onClick={() => handlePageClick(page - 1)}
              />
              </PaginationItem>
              {
              getPageIndexOptions(5, totalPaginas, page).map((item, i) => (
                  <PaginationItem active={item+1 === page} key={i}>
                      <PaginationLink
                      onClick={() => handlePageClick(item+1)}
                      href="#"
                      >
                      {item+1}
                      </PaginationLink>
                  </PaginationItem>
              ))
              }
              <PaginationItem disabled={page+1 === totalPaginas}>
              <PaginationLink
                  next
                  href="#"
                  onClick={() => handlePageClick(page + 1)}
              />
              </PaginationItem>
          </Pagination>
        </div>
      </div>
    )

}

export default Paginate