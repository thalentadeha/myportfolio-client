document.addEventListener('DOMContentLoaded', () => {
    fetch('https://myportfolio-server-production.up.railway.app/api/v1',
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ) // Replace with your actual API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response not ok');
            }
            return response.json();
        })
        .then(data => {
            const greetingElement = document.getElementById('greeting');

            greetingElement.textContent = data.myData.nickname;

            // const typedElement = document.querySelector('.typed-text-output');
            // const positionElement = document.getElementById('position');

            // if (window.typedInstance) {
            //     window.typedInstance.destroy();
            //   }

            // positionElement.textContent = data.myData.position.join(', ');

            const cvDownload = document.getElementById('cv-download');
            cvDownload.href = data.myDataUrl.cvUrl;

            populateDescription(data.myData);
            populateSkills(data.mySkills);
            populateExperience(data.myExperiences);
            populateEducation(data.myEducations);
            populateProjects(data.myProjects, data.myDataUrl);
            populateCertificates(data.myCertificates);

            const myLocation = document.getElementById('my-location');
            myLocation.textContent = data.myData.location;

            const myPhone = document.getElementById('my-phone');
            myPhone.textContent = data.myData.phone;

            let waNumber = data.myData.phone.replace(/\D/g, "");

            if (waNumber.startsWith("0")) {
                waNumber = "62" + waNumber.substring(1);
            }

            myPhone.href = `https://wa.me/${waNumber}`;
            myPhone.target = "_blank";

            const myEmail = document.getElementById('my-email');
            myEmail.textContent = data.myData.email;

            const myInstagram = document.getElementById('my-instagram');
            myInstagram.href = data.myDataUrl.instagram;

            const myLinkedin = document.getElementById('my-linkedin');
            myLinkedin.href = data.myDataUrl.linkedin;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            greetingElement.textContent = "I'm unable to fetch the name.";
        });
});

function populateDescription(mydata) {
    const myDesc = document.getElementById('myDesc');

    myDesc.innerHTML = `
        <h3>Hi! My name is</h3>
        <h4>${mydata.fullname}</h4>
        <p class="mb-4 text-center">${mydata.desc}</p>
    `;
}

function populateSkills(skills) {
    const skillsContainer = document.getElementById('skills-container');

    const numOfSkills = skills.length;
    // console.log(numOfSkills);

    const progressBars = ['bg-info', 'bg-danger', 'bg-primary', 'bg-dark', 'bg-warning', 'bg-success'];

    let skillRow = document.createElement('div');
    skillRow.className = 'row'; // Add a row class for Bootstrap grid
    for (let i = 0; i < numOfSkills; i++) {
        const skillHalf = document.createElement('div');
        skillHalf.className = 'col-md-6';

        const progressBar = progressBars[i % progressBars.length];

        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill mb-4';
        skillDiv.innerHTML = `
        <div class="d-flex justify-content-between">
            <h6 class="font-weight-bold">${skills[i].name}</h6>
            <h6 class="font-weight-bold">${skills[i].profiency}%</h6>
        </div>
        <div class="progress">
            <div class="progress-bar ${progressBar}" role="progressbar" style="width: ${skills[i].profiency}%;"
                 aria-valuenow="${skills[i].profiency}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    `;

        skillHalf.appendChild(skillDiv);
        skillRow.appendChild(skillHalf);
        if ((i + 1) % 2 === 0 || i === numOfSkills - 1) {
            skillsContainer.appendChild(skillRow);
            skillRow = document.createElement('div');
            skillRow.className = 'row'; // Reset the row for the next set
        }
    }
}

function populateExperience(experiences) {
    const experiencesTab = document.getElementById('experience-tab');

    experiences.forEach(experience => {
        const experienceDiv = document.createElement('div');
        experienceDiv.className = 'col-sm-6';

        const startDate = new Date(experience.startDate);
        const startYear = startDate.getFullYear();
        const startMonth = startDate.toLocaleString("default", { month: "long" });

        let endText;

        if (!experience.endDate) {
            endText = "Present";
        } else {
            const endDate = new Date(experience.endDate);
            const endYear = endDate.getFullYear();
            const endMonth = endDate.toLocaleString("default", { month: "long" });
            endText = `${endMonth} ${endYear}`;
        }

        experienceDiv.innerHTML = `
            <h5>${experience.position}</h5>
            <hr class="text-info my-2">
            <p class="text-info mb-1 fw-bold">${startMonth} ${startYear} - ${endText}</p>
            <h6 class="mb-0">${experience.company}</h6>
        `;

        experiencesTab.appendChild(experienceDiv);
    });
}

function populateEducation(educations) {
    const educationsTab = document.getElementById('education-tab');

    educations.forEach(education => {
        const educationDiv = document.createElement('div');
        educationDiv.className = 'col-sm-6';

        const startDate = new Date(education.startDate);
        const startYear = startDate.getFullYear();

        const endDate = new Date(education.endDate);
        const endYear = endDate.getFullYear();

        educationDiv.innerHTML = `
            <h5>${education.study}</h5>
            <hr class="text-info my-2">
            <p class="text-info mb-1 fw-bold">${startYear} - ${endYear}</p>
            <h6 class="mb-0">${education.education}</h6>
        `;

        educationsTab.appendChild(educationDiv);
    });
}

// function populateCategories(categories) {
//     const filtersContainer = document.getElementById('portfolio-flters');

//     const allLi = document.createElement('li');
//     allLi.className = 'mx-3 active';
//     allLi.setAttribute('data-filter', '*');
//     allLi.innerText = 'All Projects';
//     filtersContainer.appendChild(allLi);
//     categories.forEach(category => {
//         const li = document.createElement('li');
//         li.className = 'mx-3';
//         li.setAttribute('data-filter', '.' + category.category);
//         li.innerText = category.category;
//         filtersContainer.appendChild(li);
//     });
// }

function populateProjects(projects, myDataUrl) {
    // populateCategories(categories);
    const portfolioContainer = document.getElementById('portfolio-container');
    portfolioContainer.innerHTML = '';
    projects.forEach(project => {
        // const classes = project.categories.map(cat => cat.category).join(' ');
        const colDiv = document.createElement('div');
        colDiv.className = `col-lg-4 col-md-6 portfolio-item`;
        colDiv.innerHTML = `
            <div class="portfolio-img rounded overflow-hidden">
                <img class="img-fluid" src="${project.pictureUrl}" alt="${project.name}">
                <div class="portfolio-btn">
                    <a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href="${project.url}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>
                </div>
            </div>
        `;
        portfolioContainer.appendChild(colDiv);
    });

    const buttonContainer = document.querySelector('.button-container');
    const otherBtnDiv = document.createElement('div');
    otherBtnDiv.className = 'd-flex justify-content-center align-items-center pt-5';
    otherBtnDiv.innerHTML = `
        <a id="cv-download" href="${myDataUrl.github}" class="btn btn-info py-3 px-4 me-5">Other Projects</a>
    `;
    buttonContainer.appendChild(otherBtnDiv);
    // addFiltering();
}

// function addFiltering() {
//     const filters = document.querySelectorAll('#portfolio-flters li');
//     const portfolioItems = document.querySelectorAll('.portfolio-item');
//     filters.forEach(filter => {
//         filter.addEventListener('click', function () {
//             // Remove active class from all
//             filters.forEach(f => f.classList.remove('active'));
//             this.classList.add('active');
//             const filterValue = this.getAttribute('data-filter');
//             portfolioItems.forEach(item => {
//                 if (filterValue === '*' || item.classList.contains(filterValue.slice(1))) {
//                     item.style.display = 'block';
//                 } else {
//                     item.style.display = 'none';
//                 }
//             });
//         });
//     });
// }

function populateCertificates(certificates) {
    const certificateContainer = document.getElementById('certificates-container');
    certificateContainer.innerHTML = '';
    certificates.forEach(certificate => {
        const colDiv = document.createElement('div');

        let certificatePhoto = "";
        if (certificate.issuer == "Udemy") {
            certificatePhoto = "img/udemy-flutter-certificate.jpg";
        } else if (certificate.issuer == "BNCC") {
            certificatePhoto = "img/bncc-laravel-certificate.png";
        }
        colDiv.className = `col-lg-4 col-md-6 certificate-item`;
        colDiv.innerHTML = `
            <div class="certificate-img rounded overflow-hidden">
                <img class="img-fluid" src="${certificatePhoto}" alt="${certificate.name}">
                <div class="certificate-btn">
                    <a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href="${certificatePhoto}" data-lightbox="portfolio"><i class="fa fa-eye"></i></a>
                    <a class="btn btn-lg-square btn-outline-secondary border-2 mx-1" href="${certificate.url}" target="_blank" rel="noopener noreferrer"><i class="fa fa-link"></i></a>
                </div>
            </div>
        `;
        certificateContainer.appendChild(colDiv);
    });
}