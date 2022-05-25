import { Pagination, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const TableData = () => {
  const format = "DD-MM-YYYY";
  const [storyData, setStoryData] = useState(null);
  const [pageCount, setPageCount] = useState({
    pageNo: 0,
    totalPage: null,
  });

  useEffect(() => {
    const reRenderData = setInterval(() => tableData(), 5000);
    return () => clearInterval(reRenderData);
  }, [pageCount?.pageNo]);

  async function tableData() {
    const response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageCount?.pageNo}`);

    const responseData = await response.json();
    const findData = responseData?.hits.map((item) => {
      return { ...item, created_at: moment(item?.created_at).format(format) };
    });

    if (findData?.length > 0) {
      setStoryData(findData);
    }

    setPageCount({ pageNo: responseData?.page, totalPage: responseData?.nbPages });
  }

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", width: "20%" },
    { title: "URL", dataIndex: "url", key: "url" },
    { title: "Created At", dataIndex: "created_at", key: "created_at", width: "10%", align: "center" },
    { title: "Author", dataIndex: "author", key: "author", align: "center" },
  ];

  const onChange = (pageNumber) => {
    setPageCount({ ...pageCount, pageNo: pageNumber });
  };

  return (
    <div className="container top bottom">
      <Table bordered columns={columns} dataSource={storyData} pagination={false} rowKey={(record) => record?.title} />

      <div className="top bottom">
        <Pagination showQuickJumper defaultCurrent={pageCount?.pageNo} total={pageCount?.totalPage} onChange={onChange} />
      </div>
    </div>
  );
};

export default TableData;
