import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import "./styles.scss";
import { API_BASE_URL_ENV } from "../../../helpers/common";

const StatCard = ({ icon, amount, currency, label, variant }) => (
  <Card className="stat-card">
    <CardBody>
      <div className={`icon ${variant ? `variant-${variant}` : ""}`}>{icon}</div>
      <div className="amount">
        {amount} <span className="currency">{currency}</span>
      </div>
      <div className="label">{label}</div>
    </CardBody>
  </Card>
);

const MiniCard = ({ icon, value, label, variant }) => (
  <Card className="mini-card">
    <CardBody>
      <div className={`icon ${variant ? `variant-${variant}` : ""}`}>{icon}</div>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </CardBody>
  </Card>
);

const SectionTable = ({ title }) => (
  <Card className="section-card">
    <CardBody>
      <div className="section-title">{title}</div>
      <Row className="g-0 section-grid">
        {["Brief", "Content", "Feedback", "Publish"].map((stage, idx) => (
          <Col md={3} key={stage} className="stage">
            <div className="stage-title">{stage}</div>
            <div className="projects-count">5 Projects</div>
            <div className="stage-row">
              <span>In Progress</span>
              <span className="ok">2</span>
            </div>
            <div className="stage-row">
              <span>Pending</span>
              <span className="ok">3</span>
            </div>
          </Col>
        ))}
      </Row>
    </CardBody>
  </Card>
);

const formatCurrency = (amountCents, currency = "USD") => {
  if (typeof amountCents !== "number") return { amount: "-", currency };
  const amount = (amountCents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return { amount: `$${amount}`, currency };
};

const AdminDashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let aborted = false;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const API_BASE = API_BASE_URL_ENV();
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("admin_token") ||
          (typeof window !== "undefined" ? (window.ADMIN_TOKEN || window.token) : undefined);

        if (!token) {
          throw new Error("Missing admin token. Store it in localStorage('admin_token') or window.ADMIN_TOKEN.");
        }

        const res = await fetch(`${API_BASE}/admin/dashboard`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Request failed (${res.status}): ${text}`);
        }

        const json = await res.json();
        if (!aborted) setStats(json?.data || null);
      } catch (e) {
        if (!aborted) setError(e?.message || "Failed to load dashboard");
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      aborted = true;
    };
  }, []);

  const subs = stats?.subscriptions || {};
  const { amount: activeAmount, currency: activeCurrency } = formatCurrency(
    subs?.active_amount_cents ?? 0,
    subs?.currency || "USD"
  );

  const usersTotal = stats?.users?.total ?? 0;
  const brandsTotal = stats?.brands?.total_chats ?? 0;
  const brandNamesChats = stats?.brands?.brand_names_chats ?? 0;
  const brandTextChats = stats?.brands?.brand_text_chats ?? 0;
  const favoritesTotal = stats?.brands?.favorites_total ?? 0;
  const questionsTotal = stats?.questions?.total ?? 0;
  const meetingsTotal = stats?.meetings?.total ?? 0;
  const meetingsUpcoming = stats?.meetings?.upcoming ?? 0;
  const meetingsDone = stats?.meetings?.done ?? 0;
  const subsActive = subs?.by_status?.active ?? 0;
  const subsPending = subs?.by_status?.pending ?? 0;
  const subsCanceled = subs?.by_status?.canceled ?? 0;

  return (
    <div className="admin-container dashboard-page">
      <Container fluid className="pt-4">
        <Row className="align-items-center mb-2">
          <Col>
            <h3 className="page-title mb-0">Dashboard</h3>
            <div className="page-subtitle">
            </div>
          </Col>
          <Col md="auto">
            <input className="date-input" placeholder="dd/mm/yyyy" />
          </Col>
        </Row>

        {loading && <div className="mb-3">Loading dashboard...</div>}
        {error && <div className="mb-3 text-danger">Error: {error}</div>}

        <div className="section-heading">Subscriptions</div>
        <Row className="g-3 mb-3">
          <Col md={4}>
            <StatCard
              variant="gold"
              icon={<i className="fa fa-usd"></i>}
              amount={activeAmount}
              currency={activeCurrency}
              label="Active Subscriptions Amount"
            />
          </Col>
          <Col md={4}>
            <StatCard
              variant="blue"
              icon={<i className="fa fa-check-circle"></i>}
              amount={subsActive}
              currency=""
              label="Active Subscriptions"
            />
          </Col>
          <Col md={4}>
            <StatCard
              variant="green"
              icon={<i className="fa fa-hourglass-half"></i>}
              amount={subsPending}
              currency=""
              label="Pending Subscriptions"
            />
          </Col>
        </Row>

        <div className="section-heading">At a glance</div>
        <Row className="g-3 mb-3">
          <Col md={3}>
            <MiniCard variant="indigo" icon={<i className="fa fa-user"></i>} value={usersTotal} label="Users" />
          </Col>
          <Col md={3}>
            <MiniCard variant="emerald" icon={<i className="fa fa-comments"></i>} value={brandsTotal} label="Brand Chats" />
          </Col>
          <Col md={3}>
            <MiniCard variant="amber" icon={<i className="fa fa-question-circle"></i>} value={questionsTotal} label="Questions" />
          </Col>
          <Col md={3}>
            <MiniCard variant="slate" icon={<i className="fa fa-star"></i>} value={favoritesTotal} label="Favorites" />
          </Col>
        </Row>

        <Row className="g-3 mb-3">
          <Col md={4}>
            <MiniCard variant="blue" icon={<i className="fa fa-calendar-plus-o"></i>} value={meetingsUpcoming} label="Upcoming Meetings" />
          </Col>
          <Col md={4}>
            <MiniCard variant="green" icon={<i className="fa fa-calendar-check-o"></i>} value={meetingsDone} label="Done Meetings" />
          </Col>
          <Col md={4}>
            <MiniCard variant="slate" icon={<i className="fa fa-calendar"></i>} value={meetingsTotal} label="Total Meetings" />
          </Col>
        </Row>

        {/*<SectionTable title={`Brand Names: ${brandNamesChats} • Brand Text: ${brandTextChats} • Canceled Subs: ${subsCanceled}`} />*/}
      </Container>
    </div>
  );
};

export default AdminDashBoard;
