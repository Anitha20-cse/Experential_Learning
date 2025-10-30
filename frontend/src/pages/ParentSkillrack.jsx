import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ParentSkillrack = () => {
  const { t } = useTranslation();
  const [childData, setChildData] = useState([]);
  const [topCoders, setTopCoders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (parentData) {
        headers['x-user-role'] = 'parent';
        headers['x-user-email'] = parentData.email;
      }
      const res = await axios.get("http://localhost:5000/api/skillrack", { headers });
      setChildData(res.data.childData || []);
      setTopCoders(res.data.topCoders || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

  return (
    <div style={{
      maxWidth: "95%",
      margin: "40px auto",
      fontFamily: "Poppins",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "20px",
      borderRadius: "15px"
    }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#fff",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        fontSize: "2.5em"
      }}>
        {t('skillrackDataDashboard')}
      </h1>

      {/* Child's Data Section */}
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#fff",
        fontSize: "1.8em",
        textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
      }}>
        {t('yourChildsSkillrackData')}
      </h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "25px",
        justifyContent: "center",
        marginBottom: "50px"
      }}>
        {childData.length > 0 ? (
          childData.map((d) => (
            <div key={d._id} style={{
              border: "2px solid #fff",
              borderRadius: "15px",
              padding: "25px",
              width: "320px",
              background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}>
              <h3 style={{
                marginTop: 0,
                color: "#333",
                textAlign: "center",
                fontSize: "1.4em",
                marginBottom: "15px"
              }}>
                {d.name}
              </h3>
              <p style={{ textAlign: "center", fontWeight: "bold", color: "#555" }}>
                RegNo: {d.regNo}
              </p>
              <div style={{ marginTop: "15px" }}>
                <h4 style={{ color: "#007bff", textAlign: "center" }}>🏅 Medals</h4>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span>{t('jul')}: <strong>{d.medalJuly || 0}</strong></span>
                  <span>{t('aug')}: <strong>{d.medalAugust || 0}</strong></span>
                  <span>{t('sep')}: <strong>{d.medalSeptember || 0}</strong></span>
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <h4 style={{ color: "#28a745", textAlign: "center" }}>💻 DC</h4>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span>{t('jul')}: <strong>{d.dcJuly || 0}</strong></span>
                  <span>{t('aug')}: <strong>{d.dcAugust || 0}</strong></span>
                  <span>{t('sep')}: <strong>{d.dcSeptember || 0}</strong></span>
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <h4 style={{ color: "#dc3545", textAlign: "center" }}>📊 Leetcode</h4>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span>{t('jul')}: <strong>{d.leetcodeJuly || 0}</strong></span>
                  <span>{t('aug')}: <strong>{d.leetcodeAugust || 0}</strong></span>
                  <span>{t('sep')}: <strong>{d.leetcodeSeptember || 0}</strong></span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{
            textAlign: "center",
            width: "100%",
            color: "#fff",
            fontSize: "1.2em"
          }}>
            {t('noDataFoundForYourChild')}
          </p>
        )}
      </div>

      {/* Top Coders Section */}
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#fff",
        fontSize: "1.8em",
        textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
      }}>
        {t('topCodersFromYourChildsTeachers')}
      </h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "25px",
        justifyContent: "center"
      }}>
        {topCoders.length > 0 ? (
          topCoders.map((d, index) => (
            <div key={d._id} style={{
              border: `3px solid ${podiumColors[index] || '#fff'}`,
              borderRadius: "15px",
              padding: "25px",
              width: "320px",
              background: `linear-gradient(145deg, ${podiumColors[index] || '#ffffff'}, #f0f0f0)`,
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}>
              <div style={{
                position: "absolute",
                top: "-10px",
                right: "10px",
                background: podiumColors[index] || '#fff',
                color: "#000",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.2em"
              }}>
                {index + 1}
              </div>
              <h3 style={{
                marginTop: 0,
                color: "#333",
                textAlign: "center",
                fontSize: "1.4em",
                marginBottom: "15px"
              }}>
                {d.name}
              </h3>
              <p style={{ textAlign: "center", fontWeight: "bold", color: "#555" }}>
                RegNo: {d.regNo}
              </p>
              <p style={{ textAlign: "center", fontWeight: "bold", color: "#555" }}>
                Teacher: {d.teacher?.name || 'N/A'}
              </p>
              <p style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#333",
                fontSize: "1.2em",
                marginBottom: "15px"
              }}>
                Total Medals: {d.totalMedals}
              </p>
              <div style={{ marginTop: "15px" }}>
                <h4 style={{ color: "#007bff", textAlign: "center" }}>🏅 Medals</h4>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span>{t('jul')}: <strong>{d.medalJuly || 0}</strong></span>
                  <span>{t('aug')}: <strong>{d.medalAugust || 0}</strong></span>
                  <span>{t('sep')}: <strong>{d.medalSeptember || 0}</strong></span>
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <h4 style={{ color: "#28a745", textAlign: "center" }}>💻 DC</h4>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span>{t('jul')}: <strong>{d.dcJuly || 0}</strong></span>
                  <span>{t('aug')}: <strong>{d.dcAugust || 0}</strong></span>
                  <span>{t('sep')}: <strong>{d.dcSeptember || 0}</strong></span>
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <h4 style={{ color: "#dc3545", textAlign: "center" }}>📊 Leetcode</h4>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <span>{t('jul')}: <strong>{d.leetcodeJuly || 0}</strong></span>
                  <span>{t('aug')}: <strong>{d.leetcodeAugust || 0}</strong></span>
                  <span>{t('sep')}: <strong>{d.leetcodeSeptember || 0}</strong></span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{
            textAlign: "center",
            width: "100%",
            color: "#fff",
            fontSize: "1.2em"
          }}>
            {t('noTopCodersDataFound')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ParentSkillrack;
