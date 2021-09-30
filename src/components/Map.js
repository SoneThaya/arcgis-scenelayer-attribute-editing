import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapEl = useRef(null);

  useEffect(() => {
    loadModules([
      "esri/widgets/Editor",
      "esri/views/SceneView",
      "esri/WebScene",
    ]).then(([Editor, SceneView, WebScene]) => {
      // Create a new WebScene referencing a WebScene ID from ArcGIS Online
      const webscene = new WebScene({
        portalItem: {
          id: "a3bd04ebe7fe49fbae145ae6b9c66da7",
        },
      });

      const view = new SceneView({
        container: "viewDiv",
        qualityProfile: "high",
        map: webscene,
      });

      // Set the colors for the status values
      const visualVariablesStatus = [
        {
          type: "color",
          field: "Status",
          stops: [
            {
              value: 0, // unknown
              color: [191, 189, 189, 1],
            },
            {
              value: 1, // free
              color: [0, 204, 0, 1],
            },
            {
              value: 2, // reserved
              color: [255, 128, 0, 1],
            },
            {
              value: 3, // occupied
              color: [204, 0, 0, 1],
            },
          ],
        },
      ];

      // Set the colors for the floortype values
      const visualVariablesFloorType = [
        {
          type: "color",
          field: "FloorType",
          stops: [
            {
              value: 0, // Unknown
              color: [191, 189, 189, 1],
            },
            {
              value: 1, // Apartments
              color: [0, 182, 241, 1],
            },
            {
              value: 2, // Industrial
              color: [217, 191, 13, 1],
            },
            {
              value: 3, // Restaurants
              color: [106, 40, 199, 1],
            },
            {
              value: 4, // Retail
              color: [171, 87, 157, 1],
            },
            {
              value: 5, // Hotel
              color: [120, 174, 160, 1],
            },
          ],
        },
      ];

      // Create the renderer and configure visual variables
      const renderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
          type: "mesh-3d", // autocasts as new MeshSymbol3D()
          symbolLayers: [
            {
              type: "fill", // autocasts as new FillSymbol3DLayer()
              material: {
                color: "#ffffff",
                colorMixMode: "replace",
              },
              edges: {
                type: "solid",
                color: [0, 0, 0, 0.6],
                size: 1,
              },
            },
          ],
        },
        visualVariables: visualVariablesStatus,
      };

      // Create the Editor
      const editor = new Editor({
        view: view,
      });
      // Add widget to top-right of the view
      view.ui.add(editor, "top-right");

      view.when(() => {
        // Search in the WebScene for the scenelayer for attribute editing
        const sceneLayer = webscene.layers.find((layer) => {
          return layer.title === "BuildingsEditAttribute";
        });
        sceneLayer.renderer = renderer;

        // Setup the actions for the buttons
        const renderFloorTypeBtn = document.getElementById("renderFloorType");
        const renderStatusBtn = document.getElementById("renderStatus");
        renderFloorTypeBtn.addEventListener("click", () => {
          toggleRenderer("FloorType");
        });
        renderStatusBtn.addEventListener("click", () => {
          toggleRenderer("Status");
        });

        function toggleRenderer(type) {
          if (type === "Status") {
            renderFloorTypeBtn.classList.add("esri-button--secondary");
            renderStatusBtn.classList.remove("esri-button--secondary");
            const renderer = sceneLayer.renderer.clone();
            renderer.visualVariables = visualVariablesStatus;
            sceneLayer.renderer = renderer;
          }
          if (type === "FloorType") {
            renderFloorTypeBtn.classList.remove("esri-button--secondary");
            renderStatusBtn.classList.add("esri-button--secondary");
            const renderer = sceneLayer.renderer.clone();
            renderer.visualVariables = visualVariablesFloorType;
            sceneLayer.renderer = renderer;
          }
        }

        // Add the setting to the bottom-right of the view
        view.ui.add("setting", "bottom-right");
      });
    });
  }, []);

  return (
    <>
      <div
        id="viewDiv"
        style={{ height: "100vh", width: "100vw" }}
        ref={MapEl}
      ></div>
      <div id="setting" class="esri-widget">
        <div id="editorConfigDiv">
          <div class="editor-config">
            <button
              class="esri-button esri-button--secondary"
              id="renderFloorType"
              type="button"
              title="Floortype"
            >
              Floortype
            </button>
          </div>
          <div class="editor-config">
            <button
              class="esri-button"
              id="renderStatus"
              type="button"
              title="Status"
            >
              Status
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
