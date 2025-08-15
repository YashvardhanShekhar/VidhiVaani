import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { callGeminiChat } from "../services/geminiService";

const ChatScreen = () => {
	const [messages, setMessages] = useState([
		{
			id: "1",
			text: "Namaste! I'm VidhiVaani, your AI assistant for Indian law and Constitutional matters. How can I help you today?",
			isBot: true,
		},
	]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isOnline, setIsOnline] = useState(true);
	const flatListRef = useRef(null);

	// Monitor network connectivity
	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsOnline(state.isConnected);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const sendMessage = async () => {
		if (!inputText.trim() || isLoading) return;

		const userMessage = {
			id: Date.now().toString(),
			text: inputText.trim(),
			isBot: false,
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = inputText.trim();
		setInputText("");
		setIsLoading(true);

		try {
			const result = await callGeminiChat(currentInput);

			if (result.success) {
				const botMessage = {
					id: (Date.now() + 1).toString(),
					text: result.botResponse,
					isBot: true,
				};
				setMessages((prev) => [...prev, botMessage]);
			} else {
				const errorMessage = {
					id: (Date.now() + 1).toString(),
					text: `Error: ${result.error}`,
					isBot: true,
					isError: true,
				};
				setMessages((prev) => [...prev, errorMessage]);
			}
		} catch (error) {
			console.error("Chat error:", error);
			const errorMessage = {
				id: (Date.now() + 1).toString(),
				text: `Error: ${error.message}`,
				isBot: true,
				isError: true,
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const renderMessage = ({ item }) => (
		<View
			style={[
				styles.messageContainer,
				item.isBot
					? styles.botMessageContainer
					: styles.userMessageContainer,
			]}
		>
			<View
				style={[
					styles.messageBubble,
					item.isBot
						? item.isError
							? styles.errorBubble
							: styles.botBubble
						: styles.userBubble,
				]}
			>
				<Text
					style={[
						styles.messageText,
						item.isBot
							? item.isError
								? styles.errorText
								: styles.botText
							: styles.userText,
					]}
				>
					{item.text}
				</Text>
			</View>
		</View>
	);

	const renderLoadingIndicator = () => {
		if (!isLoading) return null;

		return (
			<View style={[styles.messageContainer, styles.botMessageContainer]}>
				<View
					style={[
						styles.messageBubble,
						styles.botBubble,
						styles.loadingBubble,
					]}
				>
					<Text style={styles.loadingText}>
						VidhiVaani is analyzing...
					</Text>
				</View>
			</View>
		);
	};

	useEffect(() => {
		if (flatListRef.current) {
			setTimeout(() => {
				flatListRef.current.scrollToEnd({ animated: true });
			}, 100);
		}
	}, [messages, isLoading]);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />

			<View style={styles.header}>
				<Text style={styles.headerTitle}>VidhiVaani ⚖️</Text>
				<View style={styles.statusContainer}>
					<View
						style={[
							styles.statusIndicator,
							{
								backgroundColor: isOnline
									? "#4CAF50"
									: "#FF9800",
							},
						]}
					/>
					<Text style={styles.statusText}>
						{isOnline ? "Online" : "Offline"}
					</Text>
				</View>
			</View>

			<View style={styles.chatContainer}>
				<FlatList
					ref={flatListRef}
					data={messages}
					renderItem={renderMessage}
					keyExtractor={(item) => item.id}
					style={styles.messagesList}
					contentContainerStyle={styles.messagesContainer}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={renderLoadingIndicator}
					keyboardShouldPersistTaps="handled"
					onContentSizeChange={() => {
						if (flatListRef.current) {
							flatListRef.current.scrollToEnd({ animated: true });
						}
					}}
				/>

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
				>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.textInput}
							value={inputText}
							onChangeText={setInputText}
							placeholder="Ask about Indian law, Constitution, or legal matters..."
							placeholderTextColor="#666"
							multiline
							maxLength={500}
							onSubmitEditing={sendMessage}
							blurOnSubmit={false}
							returnKeyType="send"
							editable={!isLoading}
						/>
						<TouchableOpacity
							style={[
								styles.sendButton,
								inputText.trim() && !isLoading
									? styles.sendButtonActive
									: null,
							]}
							onPress={sendMessage}
							disabled={!inputText.trim() || isLoading}
						>
							<Ionicons
								name="send"
								size={20}
								color={
									inputText.trim() && !isLoading
										? "#007AFF"
										: "#666"
								}
							/>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		elevation: 2,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 6,
	},
	statusText: {
		fontSize: 12,
		color: "#666",
		fontWeight: "500",
	},
	chatContainer: {
		flex: 1,
	},
	messagesList: {
		flex: 1,
	},
	messagesContainer: {
		paddingVertical: 16,
		paddingBottom: 20,
	},
	messageContainer: {
		marginVertical: 4,
		marginHorizontal: 16,
	},
	botMessageContainer: {
		alignItems: "flex-start",
	},
	userMessageContainer: {
		alignItems: "flex-end",
	},
	messageBubble: {
		maxWidth: "80%",
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
	},
	botBubble: {
		backgroundColor: "#fff",
		borderBottomLeftRadius: 4,
	},
	userBubble: {
		backgroundColor: "#007AFF",
		borderBottomRightRadius: 4,
	},
	errorBubble: {
		backgroundColor: "#FFEBEE",
		borderBottomLeftRadius: 4,
		borderLeftWidth: 3,
		borderLeftColor: "#F44336",
	},
	loadingBubble: {
		backgroundColor: "#e8e8e8",
	},
	messageText: {
		fontSize: 16,
		lineHeight: 20,
	},
	botText: {
		color: "#333",
	},
	userText: {
		color: "#fff",
	},
	errorText: {
		color: "#D32F2F",
		fontWeight: "500",
	},
	loadingText: {
		color: "#666",
		fontStyle: "italic",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	textInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 10,
		fontSize: 16,
		maxHeight: 100,
		backgroundColor: "#f9f9f9",
		textAlignVertical: "top",
	},
	sendButton: {
		marginLeft: 12,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
	},
	sendButtonActive: {
		backgroundColor: "#e3f2fd",
	},
});

export default ChatScreen;
