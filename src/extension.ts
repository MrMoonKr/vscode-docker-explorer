"use strict";
import * as vscode from "vscode";
import { AppInsightsClient } from "./appInsightsClient";
import { DockerContainers } from "./dockerContainers";
import { DockerHubManager } from "./DockerHub/DockerHubManager";
import { DockerHubTreeDataProvider } from "./dockerHubTreeDataProvider";
import { DockerImages } from "./dockerImages";
import { Executor } from "./executor";

export function activate(context: vscode.ExtensionContext) {
    const dockerContainers = new DockerContainers(context);
    vscode.window.registerTreeDataProvider("dockerContainers", dockerContainers);
    const dockerImages = new DockerImages(context);
    vscode.window.registerTreeDataProvider("dockerImages", dockerImages);
    const dockerHubTreeDataProvider = new DockerHubTreeDataProvider(context);
    vscode.window.registerTreeDataProvider("DockerHubTreeView", dockerHubTreeDataProvider);
    AppInsightsClient.sendEvent("loadExtension");

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.refreshDockerContainers", () => {
        dockerContainers.refreshDockerTree();
        AppInsightsClient.sendEvent("refreshDockerContainers");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.searchContainer", () => {
        dockerContainers.searchContainer();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.getContainer", (containerName) => {
        dockerContainers.getContainer(containerName);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.startContainer", (container) => {
        dockerContainers.startContainer(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.stopContainer", (container) => {
        dockerContainers.stopContainer(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.restartContainer", (container) => {
        dockerContainers.restartContainer(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.showContainerStatistics", (container) => {
        dockerContainers.showContainerStatistics(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.showContainerLogs", (container) => {
        dockerContainers.showContainerLogs(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.removeContainer", (container) => {
        dockerContainers.removeContainer(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.executeCommandInContainer", (container) => {
        dockerContainers.executeCommandInContainer(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.executeInBashInContainer", (container) => {
        dockerContainers.executeInBashInContainer(container.name);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.refreshDockerImages", () => {
        dockerImages.refreshDockerTree();
        AppInsightsClient.sendEvent("refreshDockerImages");
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.getImage", (repository, tag) => {
        dockerImages.getImage(repository, tag);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.runFromImage", (image) => {
        dockerImages.runFromImage(image.repository, image.tag);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.removeImage", (image) => {
        dockerImages.removeImage(image.repository, image.tag);
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.refreshDockerHub", () => {
        dockerHubTreeDataProvider.refresh();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.loginDockerHub", () => {
        dockerHubTreeDataProvider.login();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.logoutDockerHub", () => {
        dockerHubTreeDataProvider.logout();
    }));

    context.subscriptions.push(vscode.commands.registerCommand("docker-explorer.pullFromDockerHub", (element) => {
        dockerHubTreeDataProvider.pullFromHub(element.parent, element.name);
    }));

    context.subscriptions.push(vscode.window.onDidCloseTerminal((closedTerminal: vscode.Terminal) => {
        Executor.onDidCloseTerminal(closedTerminal);
    }));
}

export function deactivate() {
}
