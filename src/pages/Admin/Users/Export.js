import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, Alert } from "reactstrap";

const AdminUsersExport = () => {
  const [format, setFormat] = useState("csv");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = () => {
    setExporting(true);
    setMessage("");
    setTimeout(() => {
      setExporting(false);
      setMessage(`Export started in ${format.toUpperCase()} format.`);
    }, 800);
  };

  return (
    <div className="admin-container">
      <Container fluid className="pt-4">
        <Row className="mb-3">
          <Col>
            <h3 className="mb-0">Export Users</h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card>
              <CardBody>
                <FormGroup>
                  <Label for="format">Format</Label>
                  <Input
                    id="format"
                    type="select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">XLSX</option>
                    <option value="json">JSON</option>
                  </Input>
                </FormGroup>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="dateFrom">From</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="dateTo">To</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup check className="mb-3">
                  <Input
                    id="includeInactive"
                    type="checkbox"
                    checked={includeInactive}
                    onChange={(e) => setIncludeInactive(e.target.checked)}
                  />
                  <Label check htmlFor="includeInactive">Include inactive users</Label>
                </FormGroup>
                <Button color="primary" disabled={exporting} onClick={handleExport}>
                  {exporting ? "Exporting..." : "Start Export"}
                </Button>
                {message && <Alert color="success" className="mt-3 mb-0">{message}</Alert>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminUsersExport;

