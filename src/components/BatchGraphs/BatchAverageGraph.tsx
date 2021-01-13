import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Axiox from "axios";
import { axiosInstance } from "../../util/axiosConfig";
import Axios from "axios";
import Chart from "chart.js";
import { Batch } from "../../types";

// import { batchGrades, batchInfo } from "./BatchInfo";

const BatchAverageGraph: React.FC<{ batch: Batch }> = ({ batch }) => {
  // Generate random background colors for bars
  const randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  //   const batchInfo: any = useSelector((state) =>
  //     console.log("Redux Store: ", state)
  //   );

  useEffect(() => {
    const gradeArray: any = [];

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
          display: false,
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
                stepSize: 5,
                max: 70,
              },
            },
          ],
        },
      },
    });
  });

  return (
    <div id="batchAverageGradeChart">
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default BatchAverageGraph;
