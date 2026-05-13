// ========================================
// CHART CONFIGURATIONS
// ========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
});

function initializeCharts() {
    createAccuracyChart();
    createComparisonChart();
    createConfusionMatrix();
}

// ========================================
// ACCURACY CHART
// ========================================
function createAccuracyChart() {
    const ctx = document.getElementById('accuracyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 16}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Training Accuracy',
                    data: [0.7317, 0.8302, 0.8477, 0.8687, 0.8694, 0.8732, 0.8774, 0.8852, 0.8915, 0.8903, 0.7621, 0.8490, 0.8763, 0.8950, 0.9086, 0.9182],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    tension: 0.1,
                    fill: true,
                    clip: false
                },
                {
                    label: 'Validation Accuracy',
                    data: [0.8609, 0.8929, 0.9079, 0.9012, 0.9079, 0.9138, 0.9104, 0.9191, 0.9259, 0.9162, 0.9109, 0.9167, 0.9322, 0.9317, 0.9380, 0.9423],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    tension: 0.1,
                    fill: true,
                    clip: false
                }
            ]
        },
        options: {
            layout: {
                padding: {
                    left: 5,
                    right: 15
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                   (context.parsed.y * 100).toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Epoch',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Accuracy',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    min: 0.5,
                    max: 1.0,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ========================================
// COMPARISON CHART
// ========================================
function createComparisonChart() {
    const ctx = document.getElementById('comparisonChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Phase 1 (Base)', 'Phase 2 (Fine-Tuned)'],
            datasets: [
                {
                    label: 'Accuracy (%)',
                    data: [89.03, 91.82],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                    ],
                    borderColor: [
                        '#6366f1',
                        '#10b981'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return 'Accuracy: ' + context.parsed.y.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 85,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// ========================================
// CONFUSION MATRIX
// ========================================
function createConfusionMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 15; // 15x15 for 15 disease classes
    const cellSize = 30; // Slightly smaller to fit labels
    const paddingLeft = 80;
    const paddingTop = 80;
    
    canvas.width = (cellSize * size) + paddingLeft;
    canvas.height = (cellSize * size) + paddingTop;

    const classNames = [
        'Pep. Spot', 'Pep. Health', 'Pot. Early', 'Pot. Late', 'Pot. Health',
        'Tom. Spot', 'Tom. Early', 'Tom. Late', 'Tom. Mold', 'Tom. Sept',
        'Tom. Mite', 'Tom. Target', 'Tom. Yellow', 'Tom. Mosaic', 'Tom. Health'
    ];

    // Sample confusion matrix data
    const matrix = generateConfusionMatrix(size);

    // Draw background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px Inter';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < size; i++) {
        // X-axis (Predicted classes)
        ctx.save();
        ctx.translate(paddingLeft + (i * cellSize) + (cellSize / 2), paddingTop - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'left';
        ctx.fillText(classNames[i], 0, 0);
        ctx.restore();

        // Y-axis (Actual classes)
        ctx.textAlign = 'right';
        ctx.fillText(classNames[i], paddingLeft - 10, paddingTop + (i * cellSize) + (cellSize / 2));
    }

    // Draw matrix
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const value = matrix[i][j];
            const x = paddingLeft + (j * cellSize);
            const y = paddingTop + (i * cellSize);

            // Color based on value
            const color = getMatrixColor(value, i === j);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellSize, cellSize);

            // Border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cellSize, cellSize);

            // Text
            ctx.fillStyle = value > 50 ? '#fff' : '#000';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toString(), x + (cellSize / 2), y + (cellSize / 2));
        }
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function generateAccuracyData(epochs, start, end) {
    const data = [];
    for (let i = 0; i < epochs; i++) {
        const progress = i / epochs;
        const noise = (Math.random() - 0.5) * 0.03;
        const value = start + (end - start) * Math.pow(progress, 0.7) + noise;
        data.push(Math.min(Math.max(value, start), end));
    }
    return data;
}

function generateConfusionMatrix(size) {
    const matrix = [];
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            if (i === j) {
                // Diagonal (correct predictions) - high values
                matrix[i][j] = Math.floor(Math.random() * 10 + 90);
            } else {
                // Off-diagonal (incorrect predictions) - low values
                matrix[i][j] = Math.floor(Math.random() * 5);
            }
        }
    }
    return matrix;
}

function getMatrixColor(value, isDiagonal) {
    if (isDiagonal) {
        // Green shades for correct predictions
        if (value >= 90) return '#10b981';
        if (value >= 70) return '#34d399';
        return '#6ee7b7';
    } else {
        // Red shades for incorrect predictions
        if (value <= 2) return '#fee2e2';
        if (value <= 5) return '#fca5a5';
        return '#ef4444';
    }
}