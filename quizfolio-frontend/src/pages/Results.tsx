import React, { useEffect, useState, useContext } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonRow, IonCol, IonText, IonList, IonSelect, IonSelectOption, IonSearchbar, IonCard, IonCardContent, IonGrid, IonIcon, IonChip } from '@ionic/react';
import { filterOutline, timeOutline, schoolOutline, personOutline, mailOutline, ribbonOutline, printOutline } from 'ionicons/icons';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';
import Layout from '../components/otherlayout';
import './Results.css';

interface QuizResult {
  _id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  email: string;
  quizId: {
    _id: string;
    categoryId: string;
    totalMarks?: number;
  };
  score: number;
  timeSpent: number;
}

interface Category {
  _id: string;
  name: string;
}

const AllResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);
  const history = useHistory();

  const BONUS_THRESHOLD = 30;
  const BONUS_POINTS = 3;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch results
        const resultsResponse = await axios.get('http://localhost:5000/api/quizResult/all', {
          headers: { 'x-auth-token': token },
        });
        setResults(resultsResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to fetch data. Please ensure you are authorized.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("Unauthorized: No valid authentication token found.");
      setLoading(false);
    }
  }, [token]);

  // Extract unique classes from results for the class filter
  const uniqueClasses = Array.from(new Set(results.map(result => result.studentClass)))
    .filter(Boolean)
    .sort((a, b) => {
      // Remove any "th" suffix before comparing numerically
      const numA = parseInt(a.replace('th', ''));
      const numB = parseInt(b.replace('th', ''));
      return numA - numB; // Sort numerically
    });

  // Apply all filters (class and search term)
  const filteredResults = results.filter(result => {
    const matchesClass = !selectedClass || result.studentClass === selectedClass;
    const matchesSearch = !searchTerm || 
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesClass && matchesSearch;
  });

  const calculateScore = (score: number, timeSpent: number) => {
    const totalMarks = 10; // Set totalMarks to a fixed value of 10
    const finalScore = timeSpent < BONUS_THRESHOLD ? score + BONUS_POINTS : score;
    return {
      formattedScore: `${finalScore} / ${totalMarks}`,
      percentage: ((finalScore / totalMarks) * 100).toFixed(2) + '%',
      isBonus: timeSpent < BONUS_THRESHOLD
    };
  };

  const resetFilters = () => {
    setSelectedClass('');
    setSearchTerm('');
  };

  const printResults = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Generate HTML content for the printable version
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quiz Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #3880ff; color: white; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .bonus { color: #2dd36f; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Quiz Results Report</h1>
          <p>Total Results: ${filteredResults.length}</p>
          ${selectedClass ? `<p>Filtered by Class: ${selectedClass}</p>` : ''}
          ${searchTerm ? `<p>Search Term: "${searchTerm}"</p>` : ''}
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Score</th>
                <th>Time (sec)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredResults.map(result => {
                const { formattedScore, isBonus } = calculateScore(result.score, result.timeSpent);
                return `
                  <tr>
                    <td>${result.studentId}</td>
                    <td>${result.studentName}</td>
                    <td>${result.studentClass}</td>
                    <td>${result.email}</td>
                    <td>${formattedScore} ${isBonus ? '<span class="bonus">(+Bonus)</span>' : ''}</td>
                    <td>${result.timeSpent}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Write to the new window and print
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Give the browser a moment to load the content before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Format class display properly (removing redundant "th")
  const formatClassDisplay = (classValue: string) => {
    // If the classValue already contains "th", don't add it again
    if (classValue.includes('th')) {
      return `${classValue} Grade`;
    } else {
      return `${classValue}th Grade`;
    }
  };

  return (
    <IonPage>
      <Layout title="Quiz Results" hideFooter={true}>
        <IonContent className="ion-padding">
          <div className="results-header">
            <IonButton color="secondary" onClick={() => history.push('/teacher')}>
              Back to Dashboard
            </IonButton>
            <h1>Quiz Results</h1>
            <IonButton onClick={printResults} color="primary">
              <IonIcon slot="start" icon={printOutline} />
              Print Results
            </IonButton>
          </div>

          <IonCard className="filter-card">
            <IonCardContent>
              <div className="filter-header">
                <IonIcon icon={filterOutline} className="filter-icon" />
                <h2>Filter Results</h2>
              </div>
              
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonSelect
                      value={selectedClass}
                      placeholder="Filter by Class"
                      onIonChange={(e) => setSelectedClass(e.detail.value)}
                      interface="popover"
                      className="filter-select"
                    >
                      <IonSelectOption value="">All Classes</IonSelectOption>
                      {uniqueClasses.map((classNum) => (
                        <IonSelectOption key={classNum} value={classNum}>
                          {formatClassDisplay(classNum)}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    <IonSearchbar
                      value={searchTerm}
                      onIonChange={(e) => setSearchTerm(e.detail.value || '')}
                      placeholder="Search student name or ID"
                      className="filter-search"
                    />
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <div className="filter-actions">
                      <IonButton 
                        fill="outline" 
                        size="small" 
                        onClick={resetFilters}
                      >
                        Clear Filters
                      </IonButton>
                      
                      <div className="filter-stats">
                        <span>Showing {filteredResults.length} of {results.length} results</span>
                      </div>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {error && (
            <IonCard color="danger">
              <IonCardContent>
                <IonText color="light">
                  <p>{error}</p>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}

          <div id="printable-results">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading results...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="results-table">
                <IonGrid className="results-grid">
                  <IonRow className="results-header-row">
                    <IonCol size="1.5"><strong>Student ID</strong></IonCol>
                    <IonCol size="2.5"><strong>Name</strong></IonCol>
                    <IonCol size="1.5"><strong>Class</strong></IonCol>
                    <IonCol size="2.5"><strong>Email</strong></IonCol>
                    <IonCol size="2"><strong>Score</strong></IonCol>
                    <IonCol size="2"><strong>Time (sec)</strong></IonCol>
                  </IonRow>

                  {filteredResults.map((result) => {
                    const { formattedScore, percentage, isBonus } = calculateScore(
                      result.score,
                      result.timeSpent
                    );

                    return (
                      <IonRow key={result._id} className="results-data-row">
                        <IonCol size="1.5" className="student-id">
                          <IonIcon icon={personOutline} className="result-icon" />
                          {result.studentId}
                        </IonCol>
                        <IonCol size="2.5" className="student-name">{result.studentName}</IonCol>
                        <IonCol size="1.5" className="student-class">
                          <IonIcon icon={schoolOutline} className="result-icon" />
                          {result.studentClass}
                        </IonCol>
                        <IonCol size="2.5" className="student-email">
                          <IonIcon icon={mailOutline} className="result-icon" />
                          {result.email}
                        </IonCol>
                        <IonCol size="2" className="result-score">
                          <div className="score-container">
                            <span>{formattedScore}</span>
                            <span className="score-percentage">{percentage}</span>
                            {isBonus && <IonChip color="success" className="bonus-chip">+Bonus</IonChip>}
                          </div>
                        </IonCol>
                        <IonCol size="2" className="result-time">
                          <IonIcon icon={timeOutline} className="result-icon" />
                          <span className={result.timeSpent < BONUS_THRESHOLD ? 'time-bonus' : ''}>
                            {result.timeSpent}
                          </span>
                        </IonCol>
                      </IonRow>
                    );
                  })}
                </IonGrid>
              </div>
            ) : (
              <div className="no-results">
                <IonIcon icon={ribbonOutline} className="no-results-icon" />
                <h2>No Results Found</h2>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default AllResults;
