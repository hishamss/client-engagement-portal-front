import React, { useEffect } from "react";
import Chart from "chart.js";
import { Batch } from "../../types";

const BatchAverageGraph: React.FC<{ batch: Batch }> = ({ batch }) => {
  // Generate random background colors for bars
  const randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  useEffect(() => {
    const gradeArray: any = [];
    const goodGradeArray: Array<number | undefined> = [];
    const passingGradeArray: Array<number | undefined> = [];

    console.log("Batch Info in Graph: ", batch);

    // Get data into an array of of associates with associate Id, first name, last name, and array of individual grades
    for (const associateAssignment of batch.associateAssignments) {
      console.log(
        "associate assignment grades: ",
        associateAssignment.associate.grades
      );
      gradeArray.push({
        salesforceId: associateAssignment.associate.salesforceId,
        firstName: associateAssignment.associate.firstName,
        lastName: associateAssignment.associate.lastName,
      });
      // Add "good grade" for line plot on data array - 1 data point for each associateAssignment
      goodGradeArray.push(batch.goodGrade);

      // Add "passing grade" for line plot #2 on data array = 1 data point for each associateAssignment
      passingGradeArray.push(batch.passingGrade);

      if (associateAssignment.associate.grades) {
        // Get index of current associate
        const salesforceIdIndex = gradeArray.findIndex((el: any) => {
          return el.salesforceId === associateAssignment.associate.salesforceId;
        });
        // Create array for grades
        gradeArray[salesforceIdIndex].grades = [];
        // Push grade scores of current associate onto gradeArray
        for (const gradeObject of associateAssignment.associate.grades) {
          gradeArray[salesforceIdIndex].grades.push(gradeObject.score);
        }
      }
    }

    console.log("gradeArray= ", gradeArray);
    // Translate new gradeObj into labels and data (average test score) for chart
    const chartLabels: any = [];
    const chartData: any = [];
    const barColor: any = [];

    for (const associate of gradeArray) {
      chartLabels.push(associate.lastName);
      barColor.push(randomColor());
      // Calculate average grade for test
      const avgGrade =
        Math.round(
          (associate.grades.reduce((a: number, b: number) => a + b, 0) /
            associate.grades.length) *
            100
        ) / 100;

      chartData.push(avgGrade);
    }

    console.log("Labels: ", chartLabels);
    console.log("Data: ", chartData);
    console.log("Colors: ", barColor);
    const ctx: any = document.getElementById("myChart");

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        labels: chartLabels,
        datasets: [
          {
            label: "Associate Average Scores",
            // data: [12, 19, 3, 5, 2, 3],
            data: chartData,
            // backgroundColor: [
            //   "rgba(255, 99, 132, 0.2)",
            //   "rgba(54, 162, 235, 0.2)",
            //   "rgba(255, 206, 86, 0.2)",
            //   "rgba(75, 192, 192, 0.2)",
            //   "rgba(153, 102, 255, 0.2)",
            //   "rgba(255, 159, 64, 0.2)",
            // ],
            backgroundColor: barColor,
            // borderColor: [
            //   "rgba(255, 99, 132, 1)",
            //   "rgba(54, 162, 235, 1)",
            //   "rgba(255, 206, 86, 1)",
            //   "rgba(75, 192, 192, 1)",
            //   "rgba(153, 102, 255, 1)",
            //   "rgba(255, 159, 64, 1)",
            // ],
            // borderWidth: 1,
          },
          {
            label: "Good Grade",
            fill: false,
            borderColor: "lightgreen",
            data: goodGradeArray,
            pointRadius: 0,
            type: "line",
          },
          {
            label: "Passing Grade",
            fill: false,
            borderColor: "lightblue",
            data: passingGradeArray,
            pointRadius: 0,
            type: "line",
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Average Assessment Scores",
        },
        layout: {
          padding: 50,
        },
        legend: {
          display: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Associate Last Name",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Average Test Score",
              },
              ticks: {
                beginAtZero: true,
                stepSize: 10,
                max: 100,
              },
            },
          ],
        },
      },
    });
  });

  return <canvas id="myChart"></canvas>;
};

export default BatchAverageGraph;
