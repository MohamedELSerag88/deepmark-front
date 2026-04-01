import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  FormGroup,
  Label,
  Collapse,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import "./styles.scss";
import http from "../../../services/HttpService";
import { API_BASE_URL_ENV } from "../../../helpers/common";

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="section">
      <CardBody>
        <div className="section-head" onClick={() => setOpen(!open)}>
          <div className="title">{title}</div>
          <i className={`fa fa-chevron-${open ? "up" : "down"}`}></i>
        </div>
        <Collapse isOpen={open}>
          <div className="section-content">{children}</div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

const AdminBrand = () => {
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBrands(1, pagination.per_page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBrands = async (page = 1, perPage = 10) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await http.get(`${API_BASE_URL_ENV()}/admin/brands`, { params: { page, per_page: perPage } });
      setBrands(data?.brands || []);
      if (data?.pagination) setPagination({ ...data.pagination });
    } catch (e) {
      setError("Failed to load brands");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const extractNames = (brand) => {
    // brand_names: response.items[].name
    if (brand?.topic === "brand_names") {
      const items = Array.isArray(brand?.response?.items) ? brand.response.items : [];
      return items.map((i) => i?.name).filter(Boolean);
    }
    // brand_text: response.brand_text.taglines (support en/ar or flat)
    if (brand?.topic === "brand_text") {
      const bt = brand?.response?.brand_text;
      if (!bt) return [];
      if (Array.isArray(bt?.taglines)) return bt.taglines;
      const en = bt?.en?.taglines;
      const ar = bt?.ar?.taglines;
      if (Array.isArray(en)) return en;
      if (Array.isArray(ar)) return ar;
    }
    return [];
  };

  return (
    <div className="admin-container brand-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="page-title mb-0">Brands</h3>
            <div className="page-subtitle">All generated brand chats</div>
          </Col>
          <Col md="auto" className="text-end">
            {loading && <span className="text-muted">Loading...</span>}
            {error && <span className="text-danger">{error}</span>}
          </Col>
        </Row>

        <Row className="g-3">
          {brands.length === 0 && !loading && (
            <Col>
              <Card><CardBody className="text-muted">No brands found.</CardBody></Card>
            </Col>
          )}
          {brands.map((b) => {
            const names = extractNames(b);
            return (
              <Col md={6} key={b.id}>
                <Card className="h-100">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold">
                          #{b.id} • {b.topic} • {b.language || "-"}
                        </div>
                        <div className="small text-muted">
                          <i className="fa fa-user me-1"></i>UID {b.user_id}
                          <span className="mx-2">•</span>
                          <i className="fa fa-calendar me-1"></i>{b.created_at ? String(b.created_at).slice(0, 19).replace("T"," ") : "-"}
                        </div>
                      </div>
                      <Button size="sm" outline color="primary" onClick={() => window.location.assign(`/admin/brands/${b.id}`)}>
                        Open
                      </Button>
                    </div>
                    <div className="mt-3">
                      <div className="fw-semibold mb-1">
                        {b.topic === "brand_names" ? "Name suggestions" : "Taglines"}
                      </div>
                      {names.length ? (
                        <div className="d-flex flex-wrap gap-2">
                          {names.slice(0, 8).map((n, idx) => (
                            <span key={idx} className="badge rounded-pill bg-light text-dark px-3 py-2">
                              {n}
                            </span>
                          ))}
                          {names.length > 8 && (
                            <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2">
                              +{names.length - 8} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted small">No suggestions</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Row className="mt-3 align-items-center">
          <Col md={4} className="mb-2 mb-md-0">
            <div className="text-muted small">
              {(() => {
                const page = pagination.current_page || 1;
                const per = pagination.per_page || 10;
                const total = pagination.total || 0;
                const start = total === 0 ? 0 : (page - 1) * per + 1;
                const end = Math.min(page * per, total);
                return `Showing ${start}-${end} of ${total}`;
              })()}
            </div>
          </Col>
          <Col md={4} className="d-flex justify-content-md-center mb-2 mb-md-0">
            {(() => {
              const totalPages = pagination.last_page || 1;
              const current = pagination.current_page || 1;
              const per = pagination.per_page || 10;
              const buildPages = (total, cur) => {
                const neighbors = 1; // pages on each side
                const pages = [];
                const push = (v) => pages.push(v);
                push(1);
                let start = Math.max(2, cur - neighbors);
                let end = Math.min(total - 1, cur + neighbors);
                if (start > 2) push("left-ellipsis");
                for (let n = start; n <= end; n++) push(n);
                if (end < total - 1) push("right-ellipsis");
                if (total > 1) push(total);
                return pages;
              };
              const pages = buildPages(totalPages, current);
              return (
                <Pagination size="sm" className="mb-0">
                  <PaginationItem disabled={current <= 1}>
                    <PaginationLink first onClick={() => loadBrands(1, per)} />
                  </PaginationItem>
                  <PaginationItem disabled={current <= 1}>
                    <PaginationLink previous onClick={() => current > 1 && loadBrands(current - 1, per)} />
                  </PaginationItem>
                  {pages.map((p, idx) =>
                    typeof p === "number" ? (
                      <PaginationItem active={p === current} key={idx}>
                        <PaginationLink onClick={() => loadBrands(p, per)}>{p}</PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem disabled key={idx}>
                        <PaginationLink>…</PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem disabled={current >= totalPages}>
                    <PaginationLink next onClick={() => current < totalPages && loadBrands(current + 1, per)} />
                  </PaginationItem>
                  <PaginationItem disabled={current >= totalPages}>
                    <PaginationLink last onClick={() => loadBrands(totalPages, per)} />
                  </PaginationItem>
                </Pagination>
              );
            })()}
          </Col>
          <Col md={4} className="d-flex justify-content-md-end">
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted">Rows per page</span>
              <Input
                type="select"
                bsSize="sm"
                style={{ width: 90 }}
                value={pagination.per_page || 10}
                onChange={(e) => {
                  const per = parseInt(e.target.value, 10) || 10;
                  loadBrands(1, per);
                }}
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Input>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminBrand;

