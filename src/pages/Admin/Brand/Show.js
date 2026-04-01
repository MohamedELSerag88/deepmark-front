import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Badge } from "reactstrap";
import http from "../../../services/HttpService";
import { API_BASE_URL_ENV } from "../../../helpers/common";

const AdminBrandShow = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await http.get(`${API_BASE_URL_ENV()}/admin/brands/${id}`);
        if (mounted) setBrand(data?.brand || null);
      } catch (e) {
        if (mounted) setError("Failed to load brand");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const namesOrTaglines = (() => {
    if (!brand) return [];
    if (brand.topic === "brand_names") {
      const items = Array.isArray(brand?.response?.items) ? brand.response.items : [];
      return items.map((it) => it?.name).filter(Boolean);
    }
    if (brand.topic === "brand_text") {
      const bt = brand?.response?.brand_text;
      if (!bt) return [];
      if (Array.isArray(bt?.taglines)) return bt.taglines;
      const en = bt?.en?.taglines;
      const ar = bt?.ar?.taglines;
      if (Array.isArray(en)) return en;
      if (Array.isArray(ar)) return ar;
    }
    return [];
  })();

  const answers = Array.isArray(brand?.answers) ? brand.answers : [];

  return (
    <div className="admin-container brand-show-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h3 className="mb-1">Brand #{id}</h3>
            {brand?.topic && <Badge color="light" className="text-dark">{brand.topic}</Badge>}
          </Col>
          <Col md="auto">
            {loading && <span className="text-muted">Loading...</span>}
            {error && <span className="text-danger">{error}</span>}
          </Col>
        </Row>

        {brand && (
          <>
            <Row className="g-3">
              <Col md={4}>
                <Card>
                  <CardBody>
                    <div className="label text-muted small">User</div>
                    <div className="value">#{brand.user_id}</div>
                    <div className="label text-muted small mt-3">Language</div>
                    <div className="value">{brand.language || "-"}</div>
                    <div className="label text-muted small mt-3">Created</div>
                    <div className="value">{brand.created_at ? String(brand.created_at).slice(0,19).replace("T"," ") : "-"}</div>
                    <div className="label text-muted small mt-3">Updated</div>
                    <div className="value">{brand.updated_at ? String(brand.updated_at).slice(0,19).replace("T"," ") : "-"}</div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={8}>
                <Card>
                  <CardBody>
                    <div className="fw-semibold mb-2">
                      {brand.topic === "brand_names" ? "Name suggestions" : "Taglines"}
                    </div>
                    {namesOrTaglines.length ? (
                      <div className="d-flex flex-wrap gap-2">
                        {namesOrTaglines.map((n, idx) => (
                          <span key={idx} className="badge rounded-pill bg-light text-dark px-3 py-2">
                            {n}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted">No suggestions</div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Card>
                  <CardBody>
                    <div className="fw-semibold mb-2">Q&A</div>
                    {answers.length ? (
                      <ul className="mb-0">
                        {answers.map((a, i) => (
                          <li key={i} className="small">
                            <span className="text-muted">Q#{a.question_id}:</span>{" "}
                            {Array.isArray(a.value) ? a.value.join(", ") : a.value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted">No answers</div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminBrandShow;

