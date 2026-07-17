import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button, Table } from "reactstrap";
import MarketingContactService from "../../../../services/Admin/MarketingContactService";
import { toast } from "react-toastify";

const AdminMarketingContact = () => {
  const service = new MarketingContactService();
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(1); /* eslint-disable-next-line */ }, []);

  const load = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await service.list({ page, per_page: pagination.per_page || 20 });
      setList(data?.submissions || []);
      if (data?.pagination) setPagination(data.pagination);
    } catch (e) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (row, is_read) => {
    try {
      await service.update(row.id, { is_read });
      toast.success(is_read ? "Marked read" : "Marked unread");
      load(pagination.current_page || 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const del = async (row) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await service.remove(row.id);
      toast.success("Deleted");
      load(pagination.current_page || 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-container">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col><h3 className="page-title mb-0">Contact Submissions</h3></Col>
        </Row>
        <Card>
          <CardBody>
            {loading && <div className="text-muted">Loading...</div>}
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Brand</th>
                  <th>Budget</th>
                  <th>Read</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && list.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted py-4">No submissions found.</td></tr>
                )}
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.brand || "—"}</td>
                    <td>{row.budget || "—"}</td>
                    <td>{row.is_read ? "Yes" : "No"}</td>
                    <td className="text-end">
                      <Button size="sm" outline color="primary" className="me-2" onClick={() => markRead(row, !row.is_read)}>
                        {row.is_read ? "Unread" : "Read"}
                      </Button>
                      <Button size="sm" outline color="danger" onClick={() => del(row)}>
                        <i className="fa fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {pagination.last_page > 1 && (
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button size="sm" disabled={pagination.current_page <= 1} onClick={() => load(pagination.current_page - 1)}>Prev</Button>
                <span className="align-self-center text-muted">Page {pagination.current_page} / {pagination.last_page}</span>
                <Button size="sm" disabled={pagination.current_page >= pagination.last_page} onClick={() => load(pagination.current_page + 1)}>Next</Button>
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AdminMarketingContact;
