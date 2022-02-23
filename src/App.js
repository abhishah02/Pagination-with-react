import "./App.css";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";

const App = () => {
  const [items, setItems] = useState([]);

  const [pageCount, setPageCount] = useState(0);

  const [order, setOrder] = useState("ASC");

  const [idOrder, setIdOrder] = useState("INC");

  const [dateOrder, setDateOrder] = useState("ADS");

  const [searchTerm, setSearchTerm] = useState("");

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...items].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setItems(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...items].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setItems(sorted);
      setOrder("ASC");
    }
  };

  const idSorting = (cole) => {
    if (idOrder === "INC") {
      const sorted = [...items].sort((a, b) => (a[cole] > b[cole] ? 1 : -1));
      setItems(sorted);
      setIdOrder("DEC");
    }
    if (idOrder === "DEC") {
      const sorted = [...items].sort((a, b) => (a[cole] < b[cole] ? 1 : -1));
      setItems(sorted);
      setIdOrder("INC");
    }
  };

  const dateSorting = (clm) => {
    if (dateOrder === "ADS") {
      const sorted = [...items].sort((a, b) =>
        a.date.split("/").reverse() > b.date.split("/").reverse() ? 1 : -1
      );
      setItems(sorted);
      setDateOrder("SDA");
    }
    if (dateOrder === "SDA") {
      const sorted = [...items].sort((a, b) =>
        a.date.split("/").reverse() < b.date.split("/").reverse() ? 1 : -1
      );
      setItems(sorted);
      setDateOrder("ADS");
    }
  };

  let limit = 10;

  useEffect(() => {
    const getComments = async () => {
      const res = await fetch(
        `http://localhost:3004/comments?_page=1&_limit=${limit}`
      );
      const data = await res.json();
      const total = res.headers.get("x-total-count");
      setPageCount(Math.ceil(total / limit));
      setItems(data);
    };

    getComments();
  }, []);

  const fetchComments = async (currentPage) => {
    const res = await fetch(
      `http://localhost:3004/comments?_page=${currentPage}&_limit=${limit}`
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data) => {
    console.log(data.selected + 1);

    let currentPage = data.selected + 1;

    const commentsFormServer = await fetchComments(currentPage);
    setItems(commentsFormServer);
  };
  return (
    <div className="container">
      {!items ? (
        "No Data Found"
      ) : (
        <>
          <nav class="navbar navbar-light bg-light">
            <form class="form-inline">
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </form>
          </nav>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th onClick={() => idSorting("id")}>Id</th>
                <th onClick={() => sorting("name")}>Name</th>
                <th onClick={() => sorting("email")}>Email</th>
                <th onClick={() => dateSorting("date")}>Date</th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((item) => {
                  if (searchTerm == "") {
                    return item;
                  } else if (
                    item.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return item;
                  }
                })
                .map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.date}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </>
      )}

      {/* <div className="row m-2">
        {items.map((item) => {
          return (
            // <div key={item.id} className="col-sm-6 col-md-4 v my-2">
            //   <div className="card shadow-sm w-100" style={{ minHeight: 225 }}>
            //     <div className="card-body">
            //       <h5 className="card-title text-center h2">Id :{item.id} </h5>
            //       <h6 className="card-title text-center h6">{item.name}</h6>
            //       <h6 className="card-subtitle mb-2 text-muted text-center">
            //         {item.email}
            //       </h6>
            //       <p className="card-text">{item.body}</p>
            //     </div>
            //   </div>
            // </div>
            
          );
        })}
      </div> */}

      <ReactPaginate
        previousLabel={"<<"}
        nextLabel={">>"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default App;
