document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const progressBar = document.getElementById('progressBar');
    const consoleText = document.getElementById('consoleText');

    let currentCandidates = [];

    // Initial Load
    fetchLeaderboard();

    // Polling every 5 seconds
    setInterval(fetchLeaderboard, 5000);

    // Drop zone interactions
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    ['dragleave', 'drop'].forEach(event => {
        dropZone.addEventListener(event, () => dropZone.classList.remove('dragover'));
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateDropZoneText(e.dataTransfer.files[0].name);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateDropZoneText(fileInput.files[0].name);
        }
    });

    function updateDropZoneText(name) {
        dropZone.querySelector('p').textContent = `File Selected: ${name}`;
        writeToConsole(`> Resume detected: ${name}. Ready for analysis.`);
    }

    // Form Submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        
        try {
            progressBar.parentElement.style.display = 'block';
            progressBar.style.width = '30%';
            writeToConsole("> Uploading candidate data to AI Engine...");

            const response = await fetch('/upload/', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (response.ok) {
                progressBar.style.width = '100%';
                writeToConsole(`> SUCCESS: Candidate ${formData.get('name')} queued for deep analysis.`);
                
                setTimeout(() => {
                    progressBar.parentElement.style.display = 'none';
                    progressBar.style.width = '0%';
                    uploadForm.reset();
                    dropZone.querySelector('p').textContent = 'Drag & Drop Resume (PDF)';
                    fetchLeaderboard();
                }, 1000);
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            writeToConsole(`> ERROR: Analysis failed. ${error.message}`);
            progressBar.parentElement.style.display = 'none';
        }
    });

    async function fetchLeaderboard() {
        try {
            const response = await fetch('/leaderboard/');
            const data = await response.json();
            
            // If new data found, update
            if (JSON.stringify(data) !== JSON.stringify(currentCandidates)) {
                currentCandidates = data;
                renderLeaderboard(data);
            }
        } catch (error) {
            console.error('Leaderboard fetch failed:', error);
        }
    }

    function renderLeaderboard(candidates) {
        leaderboardBody.innerHTML = '';
        if (candidates.length === 0) {
            leaderboardBody.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">No analyses performed yet.</div>';
            return;
        }

        candidates.forEach((c, index) => {
            const initial = c.name.charAt(0).toUpperCase();
            const item = document.createElement('div');
            item.className = 'candidate-item';
            item.style.animationDelay = `${index * 0.1}s`;
            item.dataset.id = c.id;
            
            item.innerHTML = `
                <div class="candidate-info">
                    <div class="avatar">${initial}</div>
                    <div class="candidate-details">
                        <h3>${c.name}</h3>
                        <span>Rank #${index + 1} • Skills: ${c.target_skills || 'N/A'}</span>
                    </div>
                </div>
                <div class="score-badge">${c.score}%</div>
            `;

            item.addEventListener('click', () => {
                document.querySelectorAll('.candidate-item').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                showAnalysis(c);
            });

            leaderboardBody.appendChild(item);
        });
    }

    function showAnalysis(candidate) {
        const text = `> ANALYZING: ${candidate.name.toUpperCase()}
> SCORE: ${candidate.score}%
> TARGET SKILLS: [${candidate.target_skills}]
> AI SUMMARY: ${candidate.summary || 'Processing summary...'}`;
        
        typeWrite(text);
    }

    function writeToConsole(message) {
        const div = document.createElement('div');
        div.textContent = message;
        consoleText.prepend(div);
    }

    let typeInterval;
    function typeWrite(text) {
        clearInterval(typeInterval);
        consoleText.innerHTML = '';
        let i = 0;
        
        typeInterval = setInterval(() => {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    consoleText.innerHTML += '<br>';
                } else {
                    consoleText.innerHTML += text.charAt(i);
                }
                i++;
                consoleText.scrollTop = consoleText.scrollHeight;
            } else {
                clearInterval(typeInterval);
            }
        }, 15);
    }
});
